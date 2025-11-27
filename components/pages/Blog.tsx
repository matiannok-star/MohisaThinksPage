import React, { useState } from "react";
import Navigation from "../Navigation";
import Footer from "../sections/Footer";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Search, Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const categories = ["All", "About AI", "AI Automation", "AI Integration", "AI Development"];

const blogPosts = [
  {
    id: 1,
    title: "Understanding AI and Its Real-World Applications",
    excerpt: "Explore how artificial intelligence is transforming industries from healthcare to finance, and learn what AI can really do for your business.",
    category: "About AI",
    date: "2024-03-15",
    readTime: "5 min",
    image: "https://picsum.photos/800/600?random=101",
  },
  {
    id: 2,
    title: "Automating Your Business Workflows with AI",
    excerpt: "Discover how to leverage AI-powered automation tools like n8n and Zapier to streamline repetitive tasks and boost productivity.",
    category: "AI Automation",
    date: "2024-03-10",
    readTime: "7 min",
    image: "https://picsum.photos/800/600?random=102",
  },
  {
    id: 3,
    title: "Integrating AI into Existing Systems",
    excerpt: "Learn best practices for seamlessly integrating AI capabilities into your current tech stack without disrupting operations.",
    category: "AI Integration",
    date: "2024-03-05",
    readTime: "6 min",
    image: "https://picsum.photos/800/600?random=103",
  },
  {
    id: 4,
    title: "Building Custom AI Solutions from Scratch",
    excerpt: "A comprehensive guide to developing custom AI applications tailored to your specific business needs and requirements.",
    category: "AI Development",
    date: "2024-02-28",
    readTime: "10 min",
    image: "https://picsum.photos/800/600?random=104",
  },
  {
    id: 5,
    title: "AI vs Machine Learning: What's the Difference?",
    excerpt: "Clarify the confusion between AI and ML, understand their relationship, and learn which technology suits your project.",
    category: "About AI",
    date: "2024-02-20",
    readTime: "4 min",
    image: "https://picsum.photos/800/600?random=105",
  },
  {
    id: 6,
    title: "Workflow Automation Best Practices for 2024",
    excerpt: "Stay ahead with the latest trends and techniques in workflow automation, including no-code solutions and AI assistants.",
    category: "AI Automation",
    date: "2024-02-15",
    readTime: "8 min",
    image: "https://picsum.photos/800/600?random=106",
  },
  {
    id: 7,
    title: "API Integration Strategies for AI Services",
    excerpt: "Master the art of connecting multiple AI APIs to create powerful integrated solutions for complex business problems.",
    category: "AI Integration",
    date: "2024-02-10",
    readTime: "7 min",
    image: "https://picsum.photos/800/600?random=107",
  },
  {
    id: 8,
    title: "From Prototype to Production: AI Development Lifecycle",
    excerpt: "Navigate the complete journey of AI development from initial concept to deployed production system with confidence.",
    category: "AI Development",
    date: "2024-02-05",
    readTime: "12 min",
    image: "https://picsum.photos/800/600?random=108",
  },
];

const POSTS_PER_PAGE = 6;

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter posts
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // Reset to page 1 when filters change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Mohisa Thinks <span className="text-primary text-glow-cyan">Blog</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Insights on AI, automation, and intelligent systems. Learn how to transform 
              your ideas into smart, automated solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {paginatedPosts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {paginatedPosts.map((post, index) => (
                    <article
                      key={post.id}
                      className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 group animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Image */}
                      <div className="aspect-video bg-muted overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {post.category}
                          </Badge>
                        </div>

                        <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readTime}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="group-hover:text-primary"
                          >
                            Read <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-primary" : ""}
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No articles found. Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;