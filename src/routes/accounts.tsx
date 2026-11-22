import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, Plus, Trash2, Wallet } from "lucide-react";

export const Route = createFileRoute("/accounts")({ component: AccountsPage });

type Entry = { id: string; kind: "sale" | "expense" | "credit-in" | "credit-out"; amount: number; note: string; date: string };
type Stock = { id: string; name: string; quantity: number; cost: number; price: number };
const KEY = "ai-buddy-accounts-v2";
const STOCK_KEY = "ai-buddy-stock-v1";
const money = (value: number) => new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value);

function AccountsPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [stock, setStock] = useState<Stock[]>([]);
  const [kind, setKind] = useState<Entry["kind"]>("sale");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    try { setEntries(JSON.parse(localStorage.getItem(KEY) || "[]")); setStock(JSON.parse(localStorage.getItem(STOCK_KEY) || "[]")); } catch { /* Ignore damaged local data. */ }
  }, []);
  const totals = useMemo(() => {
    const sum = (k: Entry["kind"]) => entries.filter((e) => e.kind === k).reduce((n, e) => n + e.amount, 0);
    return { sales: sum("sale"), expenses: sum("expense"), received: sum("credit-in"), payable: sum("credit-out") };
  }, [entries]);
  const profit = totals.sales - totals.expenses;
  function saveEntries(next: Entry[]) { setEntries(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* Device storage may be full. */ } }
  function saveStock(next: Stock[]) { setStock(next); try { localStorage.setItem(STOCK_KEY, JSON.stringify(next)); } catch { /* Device storage may be full. */ } }
  function addEntry(event: FormEvent) {
    event.preventDefault(); const value = Number(amount); if (!Number.isFinite(value) || value <= 0) return;
    saveEntries([{ id: crypto.randomUUID(), kind, amount: value, note: note.trim(), date: new Date().toLocaleDateString() }, ...entries]); setAmount(""); setNote("");
  }
  function addStock(event: FormEvent) {
    event.preventDefault(); const q = Number(quantity), c = Number(cost), p = Number(price);
    if (!itemName.trim() || !Number.isFinite(q) || q <= 0 || !Number.isFinite(c) || c < 0 || !Number.isFinite(p) || p < 0) return;
    saveStock([{ id: crypto.randomUUID(), name: itemName.trim(), quantity: q, cost: c, price: p }, ...stock]); setItemName(""); setQuantity("1"); setCost(""); setPrice("");
  }
  return <main className="min-h-dvh bg-glow px-4 py-6"><div className="mx-auto max-w-3xl">
    <Link to="/business-manager" className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4"/> Business Manager</Link>
    <header className="mb-6 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-primary/10"><Wallet className="size-6"/></span><div><h1 className="text-2xl font-bold">Accounts & Hisab-Kitab</h1><p className="text-sm text-muted-foreground">Record sales, expenses, credit and stock on this phone.</p></div></header>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[{label:"Sales",value:totals.sales},{label:"Expenses",value:totals.expenses},{label:"Net balance",value:profit},{label:"Customer credit received",value:totals.received}].map(x=><div key={x.label} className="rounded-2xl border border-border bg-card p-3"><p className="text-xs text-muted-foreground">{x.label}</p><p className="mt-1 font-bold">{money(x.value)}</p></div>)}</div>
    <section className="mt-5 rounded-2xl border border-border bg-card p-4"><h2 className="mb-3 font-semibold">Add daily record</h2><form onSubmit={addEntry} className="grid gap-3 sm:grid-cols-2">
      <select value={kind} onChange={e=>setKind(e.target.value as Entry["kind"])} className="rounded-xl border border-input bg-background p-3"><option value="sale">Sale / آمدنی</option><option value="expense">Expense / خرچہ</option><option value="credit-in">Customer paid old debt</option><option value="credit-out">I owe supplier</option></select>
      <input required type="number" min="1" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount in PKR" className="rounded-xl border border-input bg-background p-3"/>
      <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Short note (optional)" className="rounded-xl border border-input bg-background p-3 sm:col-span-2"/>
      <button className="rounded-xl bg-primary p-3 font-semibold text-primary-foreground sm:col-span-2"><Plus className="mr-1 inline size-4"/> Save record</button>
    </form></section>
    <section className="mt-5 rounded-2xl border border-border bg-card p-4"><h2 className="mb-3 font-semibold">Stock / سامان</h2><form onSubmit={addStock} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <input required value={itemName} onChange={e=>setItemName(e.target.value)} placeholder="Item name" className="col-span-2 rounded-xl border border-input bg-background p-3 sm:col-span-4"/>
      <input required type="number" min="1" value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="Quantity" className="rounded-xl border border-input bg-background p-3"/>
      <input required type="number" min="0" value={cost} onChange={e=>setCost(e.target.value)} placeholder="Cost each PKR" className="rounded-xl border border-input bg-background p-3"/>
      <input required type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} placeholder="Sale price PKR" className="col-span-2 rounded-xl border border-input bg-background p-3"/>
      <button className="col-span-2 rounded-xl bg-secondary p-3 font-semibold sm:col-span-4">Add stock item</button>
    </form><div className="mt-3 space-y-2">{stock.map(s=><div key={s.id} className="flex items-center justify-between gap-3 rounded-xl bg-secondary/50 p-3"><div className="min-w-0"><p className="truncate font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.quantity} units · Cost {money(s.cost)} · Price {money(s.price)}</p></div><button aria-label="Delete stock item" onClick={()=>saveStock(stock.filter(x=>x.id!==s.id))}><Trash2 className="size-4"/></button></div>)}{stock.length===0&&<p className="text-sm text-muted-foreground">No stock items added yet.</p>}</div></section>
    <section className="mt-5 rounded-2xl border border-border bg-card p-4"><h2 className="mb-3 font-semibold">Recent records</h2><div className="space-y-2">{entries.slice(0,30).map(e=><div key={e.id} className="flex items-center justify-between gap-3 rounded-xl bg-secondary/50 p-3"><div><p className="font-medium">{e.note || e.kind}</p><p className="text-xs text-muted-foreground">{e.date} · {e.kind}</p></div><div className="flex items-center gap-3"><strong>{money(e.amount)}</strong><button aria-label="Delete record" onClick={()=>saveEntries(entries.filter(x=>x.id!==e.id))}><Trash2 className="size-4"/></button></div></div>)}{entries.length===0&&<p className="text-sm text-muted-foreground">No records yet.</p>}</div></section>
    <p className="mt-4 text-xs leading-5 text-muted-foreground">Important: data is stored only in this browser on this phone. It is not yet synced to an online account or backed up. Net balance here is sales minus expenses, not a verified accounting statement.</p>
  </div></main>;
}
