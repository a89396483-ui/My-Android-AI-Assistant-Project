import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ClipboardList, Trash2 } from "lucide-react";

export const Route = createFileRoute("/orders")({ component: OrdersPage });
type Order = { id:string; customer:string; phone:string; address:string; item:string; amount:number; status:"new"|"confirmed"|"dispatched"|"delivered"|"returned"; payment:"COD"|"Paid"; note:string; createdAt:string };
const KEY="ai-buddy-orders-v1";
const labels:Record<Order["status"],string>={new:"New",confirmed:"Confirmed",dispatched:"Dispatched",delivered:"Delivered",returned:"Returned / RTO"};

function OrdersPage() {
  const [orders,setOrders]=useState<Order[]>([]);
  const [customer,setCustomer]=useState(""); const [phone,setPhone]=useState(""); const [address,setAddress]=useState(""); const [item,setItem]=useState(""); const [amount,setAmount]=useState(""); const [payment,setPayment]=useState<Order["payment"]>("COD"); const [note,setNote]=useState("");
  useEffect(()=>{try{setOrders(JSON.parse(localStorage.getItem(KEY)||"[]"));}catch{/* Ignore damaged local data. */}},[]);
  function save(next:Order[]){setOrders(next);try{localStorage.setItem(KEY,JSON.stringify(next));}catch{/* Device storage may be full. */}}
  function add(event:FormEvent){event.preventDefault();const total=Number(amount);if(!customer.trim()||!phone.trim()||!address.trim()||!item.trim()||!Number.isFinite(total)||total<=0)return;save([{id:crypto.randomUUID(),customer:customer.trim(),phone:phone.trim(),address:address.trim(),item:item.trim(),amount:total,status:"new",payment,note:note.trim(),createdAt:new Date().toLocaleString()},...orders]);setCustomer("");setPhone("");setAddress("");setItem("");setAmount("");setNote("");}
  function openWhatsApp(order:Order){const text=`Assalam-o-Alaikum ${order.customer}, please confirm your order: ${order.item}. Total: PKR ${order.amount}. Delivery address: ${order.address}. Reply YES to confirm or tell us if any detail needs correction.`;window.open(`https://wa.me/${order.phone.replace(/\D/g,"")}?text=${encodeURIComponent(text)}`,"_blank","noopener,noreferrer");}
  return <main className="min-h-dvh bg-glow px-4 py-6"><div className="mx-auto max-w-3xl">
    <Link to="/business-manager" className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4"/> Business Manager</Link>
    <header className="mb-6 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-primary/10"><ClipboardList className="size-6"/></span><div><h1 className="text-2xl font-bold">Orders & Customer Manager</h1><p className="text-sm text-muted-foreground">Record orders, confirm COD details and track delivery.</p></div></header>
    <form onSubmit={add} className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2"><h2 className="font-semibold sm:col-span-2">Add a customer order</h2>
      <input required value={customer} onChange={e=>setCustomer(e.target.value)} placeholder="Customer name" className="rounded-xl border border-input bg-background p-3"/>
      <input required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="WhatsApp number with country code" className="rounded-xl border border-input bg-background p-3"/>
      <input required value={item} onChange={e=>setItem(e.target.value)} placeholder="Product / service" className="rounded-xl border border-input bg-background p-3"/>
      <input required type="number" min="1" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Total amount PKR" className="rounded-xl border border-input bg-background p-3"/>
      <textarea required value={address} onChange={e=>setAddress(e.target.value)} placeholder="Full delivery address; confirm it with customer" className="min-h-20 rounded-xl border border-input bg-background p-3 sm:col-span-2"/>
      <select value={payment} onChange={e=>setPayment(e.target.value as Order["payment"])} className="rounded-xl border border-input bg-background p-3"><option value="COD">Cash on delivery</option><option value="Paid">Already paid</option></select>
      <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Order note (optional)" className="rounded-xl border border-input bg-background p-3"/>
      <button className="rounded-xl bg-primary p-3 font-semibold text-primary-foreground sm:col-span-2">Save order</button>
    </form>
    <section className="mt-5 space-y-3"><h2 className="font-semibold">Orders ({orders.length})</h2>{orders.map(order=><article key={order.id} className="rounded-2xl border border-border bg-card p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="font-semibold">{order.customer} · {order.item}</h3><p className="mt-1 text-sm text-muted-foreground">{order.phone} · {order.createdAt}</p><p className="mt-2 text-sm">{order.address}</p><p className="mt-2 font-bold">PKR {order.amount.toLocaleString("en-PK")} · {order.payment}</p></div><button aria-label="Delete order" onClick={()=>save(orders.filter(x=>x.id!==order.id))}><Trash2 className="size-4"/></button></div><div className="mt-3 flex flex-wrap gap-2"><select aria-label="Order status" value={order.status} onChange={e=>save(orders.map(x=>x.id===order.id?{...x,status:e.target.value as Order["status"]}:x))} className="min-w-0 flex-1 rounded-xl border border-input bg-background p-2 text-sm">{(Object.keys(labels) as Order["status"][]).map(s=><option key={s} value={s}>{labels[s]}</option>)}</select>{order.payment==="COD"&&<button onClick={()=>openWhatsApp(order)} className="rounded-xl bg-secondary px-3 py-2 text-sm font-semibold">Prepare COD confirmation</button>}</div>{order.note&&<p className="mt-2 text-xs text-muted-foreground">Note: {order.note}</p>}</article>)}{orders.length===0&&<p className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">No orders saved yet.</p>}</section>
    <p className="mt-4 text-xs leading-5 text-muted-foreground">Orders are saved only in this browser on this phone. WhatsApp opens a message draft; nothing is sent automatically. Confirm the customer's address and phone number before dispatch. No courier, payment or WhatsApp API is connected.</p>
  </div></main>;
}
