import React, { useState, useEffect } from 'react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  published: boolean;
  tags: string[];
  author: string;
  image?: string;
}

const BlogEditor: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPost>>({});

  useEffect(() => {
    // Initialize with default blog posts
    const defaultPosts: BlogPost[] = [
      {
        id: '1',
        title: 'Mobile Development Best Practices in 2024',
        excerpt: 'Exploring the latest trends and best practices in mobile app development, from performance optimization to user experience design.',
        content: 'Mobile development has evolved significantly in 2024. Here are the key practices every mobile developer should follow...',
        category: 'Mobile Development',
        date: '2024-01-15',
        readTime: '8 min read',
        published: true,
        tags: ['Mobile', 'iOS', 'Android', 'Best Practices'],
        author: 'Fahad Iqbal',
        image: '/blog/mobile-best-practices.jpg'
      },
      {
        id: '2',
        title: 'Leading Mobile Teams: Lessons from 13+ Years',
        excerpt: 'Insights on building and leading high-performing mobile development teams, based on real-world experience.',
        content: 'After leading mobile teams for over 13 years, I\'ve learned valuable lessons about team dynamics, project management, and technical leadership...',
        category: 'Leadership',
        date: '2024-01-10',
        readTime: '12 min read',
        published: true,
        tags: ['Leadership', 'Team Management', 'Mobile Teams'],
        author: 'Fahad Iqbal',
        image: '/blog/team-leadership.jpg'
      },
      {
        id: '3',
        title: 'Cross-Platform vs Native: Making the Right Choice',
        excerpt: 'A comprehensive guide to choosing between cross-platform frameworks and native development for your mobile project.',
        content: 'The decision between cross-platform and native development is crucial for any mobile project. Let\'s explore the factors that should influence your choice...',
        category: 'Mobile Development',
        date: '2024-01-05',
        readTime: '10 min read',
        published: true,
        tags: ['Cross-Platform', 'Native', 'React Native', 'Flutter'],
        author: 'Fahad Iqbal',
        image: '/blog/cross-platform-native.jpg'
      }
    ];
    setBlogPosts(defaultPosts);
  }, []);

  const handleSave = async () => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    let updatedPosts: BlogPost[];

    if (isCreating) {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: formData.title || '',
        excerpt: formData.excerpt || '',
        content: formData.content || '',
        category: formData.category || 'Mobile Development',
        date: formData.date || new Date().toISOString().split('T')[0],
        readTime: formData.readTime || '5 min read',
        published: formData.published || false,
        tags: formData.tags || [],
        author: formData.author || 'Fahad Iqbal',
        image: formData.image
      };
      updatedPosts = [...blogPosts, newPost];
    } else if (editingPost) {
      updatedPosts = blogPosts.map(post => 
        post.id === editingPost.id 
          ? { ...editingPost, ...formData }
          : post
      );
    } else {
      return;
    }

    setBlogPosts(updatedPosts);
    setEditingPost(null);
    setIsCreating(false);
    setFormData({});
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const updatedPosts = blogPosts.filter(post => post.id !== id);
      setBlogPosts(updatedPosts);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData(post);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'Mobile Development',
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min read',
      published: false,
      tags: [],
      author: 'Fahad Iqbal'
    });
  };

  const handleCancel = () => {
    setEditingPost(null);
    setIsCreating(false);
    setFormData({});
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData({ ...formData, tags });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Management</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          +
          New Post
        </button>
      </div>

      {(isCreating || editingPost) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {isCreating ? 'Create New Post' : 'Edit Post'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter post title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Mobile Development">Mobile Development</option>
                <option value="Leadership">Leadership</option>
                <option value="Project Management">Project Management</option>
                <option value="Technology">Technology</option>
                <option value="Career">Career</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Read Time
              </label>
              <input
                type="text"
                value={formData.readTime || ''}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="5 min read"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author
              </label>
              <input
                type="text"
                value={formData.author || ''}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Author name"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Excerpt *
            </label>
            <textarea
              value={formData.excerpt || ''}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Brief description of the post"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Full post content"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Mobile, iOS, Android"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image URL
              </label>
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="/blog/image.jpg"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.published || false}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Published
              </span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              ✓
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              ✕
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                    {post.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    post.published 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {post.date} • {post.readTime} • by {post.author}
                </div>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(post)}
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogEditor;