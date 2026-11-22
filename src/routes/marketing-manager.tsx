import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Copy, Megaphone, Sparkles } from "lucide-react";

export const Route = createFileRoute("/marketing-manager")({ component: MarketingManagerPage });

function MarketingManagerPage() {
  const [business, setBusiness] = useState("");
  const [product, setProduct] = useState("");
  const [area, setArea] = useState("");
  const [audience, setAudience] = useState("");
  const [offer, setOffer] = useState("");
  const [budget, setBudget] = useState("0");
  const [language, setLanguage] = useState("Roman Urdu");
  const [plan, setPlan] = useState("");
  const [busy, setBusy] = useState(false);
  async function generate() {
    if (!business.trim() || !product.trim()) { setPlan("Please enter your business name and what you sell."); return; }
    setBusy(true); setPlan("");
    try {
      const response = await fetch("/api/chat", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({lang:language==="Urdu"?"ur":language==="Hindi"?"hi":language==="Roman Urdu"?"roman-ur":"en",mode:"manager",messages:[{role:"user",text:`Act as a careful, practical marketing manager for a small Pakistani business. Write in ${language}. Business: ${business}. Product/service: ${product}. Area: ${area||"not provided"}. Audience: ${audience||"identify likely local customers"}. Offer: ${offer||"none"}. Maximum test budget: PKR ${budget}. Make a realistic plan: positioning, customer groups, 7-day action plan, Facebook/Instagram/WhatsApp content, 2 short video scripts, one sample advertisement, customer follow-up and simple tracking. Include free methods first and keep paid spending within the stated budget. Label assumptions. Never guarantee sales, invent research, or suggest spam or unsolicited bulk messages. Owner must approve all posts and ads.`}]}) });
      if (!response.ok || !response.body) { const data=await response.json().catch(()=>({})); throw new Error(data.error||"AI provider is not configured."); }
      const reader=response.body.getReader(), decoder=new TextDecoder(); let buffer="", answer="";
      while(true){const {value,done}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});const lines=buffer.split("\n");buffer=lines.pop()||"";for(const line of lines){if(!line.startsWith("data:"))continue;const raw=line.slice(5).trim();if(!raw||raw==="[DONE]")continue;try{const event=JSON.parse(raw) as {choices?:Array<{delta?:{content?:string}}>};answer+=event.choices?.[0]?.delta?.content||"";setPlan(answer);}catch{/* Ignore partial stream frame. */}}}
      if(!answer.trim()) setPlan("AI returned an empty response. Please try again.");
    } catch(error) { setPlan(error instanceof Error?error.message:"Could not create the plan."); }
    finally { setBusy(false); }
  }
  return <main className="min-h-dvh bg-glow px-4 py-6"><div className="mx-auto max-w-3xl">
    <Link to="/business-manager" className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4"/> Business Manager</Link>
    <header className="mb-6 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-primary/10"><Megaphone className="size-6"/></span><div><h1 className="text-2xl font-bold">Business Marketing Manager AI</h1><p className="text-sm text-muted-foreground">A marketing plan for a small shop, not just a caption generator.</p></div></header>
    <section className="rounded-2xl border border-border bg-card p-4"><div className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm">Business name<input value={business} onChange={e=>setBusiness(e.target.value)} placeholder="e.g. Ashraf General Store" className="mt-1 w-full rounded-xl border border-input bg-background p-3"/></label>
      <label className="text-sm">Products / services<input value={product} onChange={e=>setProduct(e.target.value)} placeholder="What do you sell?" className="mt-1 w-full rounded-xl border border-input bg-background p-3"/></label>
      <label className="text-sm">Area<input value={area} onChange={e=>setArea(e.target.value)} placeholder="Your city or neighbourhood" className="mt-1 w-full rounded-xl border border-input bg-background p-3"/></label>
      <label className="text-sm">Target customers<input value={audience} onChange={e=>setAudience(e.target.value)} placeholder="Who usually buys?" className="mt-1 w-full rounded-xl border border-input bg-background p-3"/></label>
      <label className="text-sm">Offer / discount<input value={offer} onChange={e=>setOffer(e.target.value)} placeholder="Optional; only a real offer" className="mt-1 w-full rounded-xl border border-input bg-background p-3"/></label>
      <label className="text-sm">Maximum test budget (PKR)<input type="number" min="0" value={budget} onChange={e=>setBudget(e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background p-3"/></label>
      <label className="text-sm sm:col-span-2">Language<select value={language} onChange={e=>setLanguage(e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background p-3"><option>Roman Urdu</option><option>Urdu</option><option>Hindi</option><option>English</option></select></label>
    </div><button disabled={busy} onClick={()=>void generate()} className="mt-4 w-full rounded-xl bg-primary p-3 font-semibold text-primary-foreground disabled:opacity-50"><Sparkles className="mr-2 inline size-4"/>{busy?"Making your plan…":"Create my marketing plan"}</button></section>
    {plan&&<section className="mt-5 rounded-2xl border border-border bg-card p-4"><div className="mb-3 flex items-center justify-between gap-2"><h2 className="font-semibold">Your marketing plan</h2><button onClick={()=>void navigator.clipboard?.writeText(plan)} className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs"><Copy className="size-4"/> Copy</button></div><pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7">{plan}</pre></section>}
    <p className="mt-4 text-xs leading-5 text-muted-foreground">This creates a draft plan only. It does not connect to Facebook, Instagram or WhatsApp, publish posts, or spend money automatically. AI provider setup may be required.</p>
  </div></main>;
}
