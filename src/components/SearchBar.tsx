import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { communitiesData } from '@/data/communities';
import { supabase } from '@/lib/supabase';
import type { Community } from '@/types/community';

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allCommunities, setAllCommunities] = useState<Community[]>(communitiesData);
  const [searchResults, setSearchResults] = useState<Community[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const loadApproved = async () => {
      try {
        const { data, error } = await supabase
          .from('community_subs')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error || !data) return;

        const mapped: Community[] = data.map((item: any) => ({
          id: item.id?.toString?.() ? item.id.toString() : String(item.id),
          name: item.community_name,
          logo: item.logo_url || '/placeholder-logo.png',
          verified: true,
          platform: item.platform,
          category: item.category,
          description: item.short_description,
          fullDescription: item.long_description,
          members: 0,
          location: 'Global',
          joinLink: item.join_type === 'paid' ? '' : item.join_link,
          joinType: item.join_type === 'paid' ? 'paid' : 'free',
          priceInr: typeof item.price_inr === 'number' ? item.price_inr : null,
          tags: [item.category, item.platform],
        }));

        if (cancelled) return;

        const mergedById = new Map<string, Community>();
        for (const c of [...mapped, ...communitiesData]) {
          mergedById.set(c.id, c);
        }

        setAllCommunities(Array.from(mergedById.values()));
      } catch {
        // ignore
      }
    };

    loadApproved();
    return () => {
      cancelled = true;
    };
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filteredResults = allCommunities
        .filter(community => 
          community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.category?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5); // Limit results to 5 items
      
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allCommunities]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Categories for suggestions
  const categories = ['Startups', 'Tech', 'Creative', 'Finance', 'Health'];

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleResultClick = (id: string) => {
    navigate(`/community/${id}`);
    setIsExpanded(false);
    setSearchQuery('');
  };

  return (
    <div ref={searchContainerRef} className="relative">
      <div className="flex items-center">
        <motion.div
          initial={false}
          animate={{ 
            width: isExpanded ? '240px' : '40px',
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="relative flex items-center"
        >
          <button
            onClick={toggleSearch}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-md border border-gray-700/30 hover:bg-gray-700/50 transition-colors"
            aria-label="Search"
          >
            <Search className="h-4 w-4 text-white" />
          </button>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '200px' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-2"
              >
                <input
                  ref={inputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search communities..."
                  className="w-full h-10 bg-gray-800/50 backdrop-blur-md border border-gray-700/30 rounded-lg px-4 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Search results */}
      <AnimatePresence>
        {isExpanded && (searchQuery.trim().length > 0 || searchResults.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-72 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
          >
            {searchResults.length > 0 ? (
              <ul className="py-1">
                {searchResults.map((result) => (
                  <li key={result.id} className="px-4 py-2 hover:bg-gray-800/80 cursor-pointer" onClick={() => handleResultClick(result.id)}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-800 mr-3 flex-shrink-0">
                        <img src={result.logo} alt={result.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-white">{result.name}</div>
                        <div className="text-xs text-gray-400">{result.category}</div>
                      </div>
                      {result.joinType === 'paid' && typeof result.priceInr === 'number' ? (
                        <Badge variant="outline" className="bg-emerald-900/40 text-emerald-300 border-emerald-700 text-[10px] shrink-0">
                          ₹{result.priceInr}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700 text-[10px] shrink-0">
                          Free
                        </Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : searchQuery.trim().length > 0 ? (
              <div className="p-4">
                <div className="text-sm text-gray-400 mb-2">No results found for "{searchQuery}"</div>
                <div className="text-xs text-gray-500">Try searching for categories:</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSearchQuery(category)}
                      className="px-2 py-1 text-xs rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
