import { useEffect,useState } from 'react';
import api from '../services/api.js';
import { Users,Package,ShoppingBag,Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
const AdminPanel=()=>{
const [users,setUsers]=useState([]);
const [products,setProducts]=useState([]);
const [orders,setOrders]=useState([]);
const [tab,setTab]=useState('users');
useEffect(()=>{fetchData();},[]);
const fetchData=async()=>{try{const[u,p,o]=await Promise.all([api.get('/admin/users'),api.get('/admin/products'),api.get('/admin/orders')]);setUsers(u.data);setProducts(p.data);setOrders(o.data);}catch(err){toast.error('Failed');}};
const removeProduct=async(id)=>{try{await api.delete('/admin/products/'+id);toast.success('Removed');fetchData();}catch{toast.error('Failed');}};
return <div className="max-w-7xl mx-auto px-4 py-8">
<h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
<div className="flex gap-2 mb-6"><button onClick={()=>setTab('users')} className={'px-4 py-2 rounded-lg '+(tab==='users'?'btn-primary':'btn-secondary')}><Users size={16} className="inline mr-1"/>Users</button><button onClick={()=>setTab('products')} className={'px-4 py-2 rounded-lg '+(tab==='products'?'btn-primary':'btn-secondary')}><Package size={16} className="inline mr-1"/>Products</button><button onClick={()=>setTab('orders')} className={'px-4 py-2 rounded-lg '+(tab==='orders'?'btn-primary':'btn-secondary')}><ShoppingBag size={16} className="inline mr-1"/>Orders</button></div>
{tab==='users'&&<div className="card overflow-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-2">Name</th><th className="text-left">Email</th><th className="text-left">Role</th></tr></thead><tbody>{users.map(u=><tr key={u._id} className="border-b"><td className="py-2">{u.name}</td><td>{u.email}</td><td><span className={'px-2 py-0.5 rounded text-xs '+(u.role==='admin'?'bg-purple-100 text-purple-700':u.role==='seller'?'bg-blue-100 text-blue-700':'bg-green-100 text-green-700')}>{u.role}</span></td></tr>)}</tbody></table></div>}
{tab==='products'&&<div className="card overflow-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-2">Title</th><th className="text-left">Seller</th><th className="text-left">Price</th><th></th></tr></thead><tbody>{products.map(p=><tr key={p._id} className="border-b"><td className="py-2">{p.title}</td><td>{p.seller?.name}</td><td>Rs. {p.price}</td><td><button onClick={()=>removeProduct(p._id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button></td></tr>)}</tbody></table></div>}
{tab==='orders'&&<div className="card overflow-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-2">ID</th><th className="text-left">Buyer</th><th className="text-left">Seller</th><th className="text-left">Status</th></tr></thead><tbody>{orders.map(o=><tr key={o._id} className="border-b"><td className="py-2 font-mono">{o._id.slice(-8)}</td><td>{o.buyer?.name}</td><td>{o.seller?.name}</td><td><span className={'px-2 py-0.5 rounded text-xs '+(o.status==='delivered'?'bg-green-100 text-green-700':o.status==='cancelled'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700')}>{o.status}</span></td></tr>)}</tbody></table></div>}
</div>;};export default AdminPanel;