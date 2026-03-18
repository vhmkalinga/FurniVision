import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api';

export default function BlogPost() {
    const { slug } = useParams();
    const { user } = useAuth();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');

    useEffect(() => {
        api.get(`/blogs/${slug}`).then(r => {
            setBlog(r.data.blog);
            setComments(r.data.comments);
        }).catch(() => { }).finally(() => setLoading(false));
    }, [slug]);

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user) return toast.error('Please login to comment');
        try {
            const r = await api.post(`/blogs/${blog._id}/comments`, { content: comment });
            setComments([r.data.comment, ...comments]);
            setComment('');
            toast.success('Comment posted!');
        } catch { toast.error('Failed to post comment'); }
    };

    const deleteComment = async (id) => {
        try {
            await api.delete(`/blogs/comments/${id}`);
            setComments(comments.filter(c => c._id !== id));
            toast.success('Comment deleted');
        } catch { toast.error('Failed to delete'); }
    };

    if (loading) return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <div className="space-y-4">
                <div className="h-4 w-24 skeleton" />
                <div className="h-10 w-2/3 skeleton" />
                <div className="h-4 w-40 skeleton" />
                {[...Array(4)].map((_, i) => <div key={i} className="h-4 skeleton" style={{ width: `${95 - i * 5}%` }} />)}
            </div>
        </div>
    );

    if (!blog) return <div className="text-center py-32"><h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Post not found</h2></div>;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
            <Link to="/blog" className="btn-ghost mb-8"><ArrowLeft className="w-4 h-4" /> Back to Blog</Link>

            <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="badge badge-accent mb-4">Blog</span>
                <h1 className="text-3xl sm:text-4xl heading-display mb-5">{blog.title}</h1>
                <div className="flex items-center gap-3 text-xs mb-10 pb-8" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                    <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <span>·</span>
                    <span>{blog.author?.name}</span>
                    <span>·</span>
                    <span>{blog.views} views</span>
                </div>

                <div className="prose-custom text-sm leading-[1.85]" style={{ color: 'var(--text-secondary)' }}>
                    {blog.content.split('\n').map((para, i) => {
                        if (para.startsWith('**') && para.endsWith('**'))
                            return <h3 key={i} className="text-lg font-semibold mt-10 mb-4 heading-sans" style={{ color: 'var(--text-primary)' }}>{para.replace(/\*\*/g, '')}</h3>;
                        return para.trim() ? <p key={i} className="mb-4">{para}</p> : null;
                    })}
                </div>
            </motion.article>

            {/* Comments */}
            <div className="mt-16 pt-10" style={{ borderTop: '1px solid var(--border-color)' }}>
                <h2 className="text-lg font-semibold heading-sans mb-8" style={{ color: 'var(--text-primary)' }}>Comments ({comments.length})</h2>

                {user && (
                    <form onSubmit={handleComment} className="mb-10 flex gap-3">
                        <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a comment..." required className="input-field flex-1" />
                        <button type="submit" className="btn-primary px-5">Post</button>
                    </form>
                )}

                <div className="space-y-4">
                    {comments.map(c => (
                        <div key={c._id} className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--accent)' }}>{c.userId?.name?.[0]}</div>
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{c.userId?.name}</span>
                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                                {(user?.role === 'admin' || user?._id === c.userId?._id) && (
                                    <button onClick={() => deleteComment(c._id)} className="p-1.5 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/15">
                                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                    </button>
                                )}
                            </div>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{c.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
