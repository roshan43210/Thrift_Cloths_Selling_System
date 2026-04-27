import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { Heart,Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
const Wishlist=()=>{
const [items,setItems]=useState([]);
const [loading,setLoading]=useState(true);
useEffect(()=>{api.get('/wishlist').then(r=>setItems(r.data.products||[])).catch(()=>toast.error('Failed')).finally(()=>setLoading(false));},[]);
const remove=(pid)=>{api.delete('/wishlist/'+pid).then(r=>{setItems(r.data.products||[]);toast.success('Removed');}).catch(()=>toast.error('Failed'));};
if(loading){return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;}
return <div className="max-w-6xl mx-auto px-4 py-8">
<h1 className="text-2xl font-bold mb-6 flex items-center"><Heart className="mr-2" /> My Wishlist</h1>
{items.length===0?<div className="text-center py-20 text-gray-500"><Heart size={48} className="mx-auto text-gray-300 mb-4" /><p>Your wishlist is empty.</p><Link to="/products" className="mt-4 inline-block btn-primary">Browse Products</Link></div>:
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">{items.map(p=><div key={p._id} className="card"><Link to={'/product/'+p._id}><img src={p.images[0]} alt={p.title} className="w-full h-48 object-cover rounded-lg mb-3" /></Link><h3 className="font-semibold truncate">{p.title}</h3><p className="text-sm text-gray-500">{p.category}</p><div className="flex items-center justify-between mt-2"><span className="font-bold text-primary">Rs. {p.price}</span><button onClick={()=>remove(p._id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button></div></div>)}</div>}
</div>;};export default Wishlist;