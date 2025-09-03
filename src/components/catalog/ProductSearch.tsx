import { useState, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  suggestions?: string[];
  recentSearches?: string[];
  popularSearches?: string[];
}

export function ProductSearch({
  searchQuery,
  onSearchChange,
  suggestions = [],
  recentSearches = ['Panadol', 'Blood pressure monitor', 'Vitamin C'],
  popularSearches = ['Pain relief', 'Diabetes', 'First aid', 'Cosmetics']
}: ProductSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onSearchChange(value);
  };

  const handleClear = () => {
    setInputValue('');
    onSearchChange('');
    setIsOpen(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onSearchChange(suggestion);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const showSuggestions = isOpen && (inputValue.length > 0 || recentSearches.length > 0);

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search medicines, equipment, cosmetics..."
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 h-12 text-base"
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showSuggestions && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute top-full left-0 right-0 mt-1 z-20 max-h-96 overflow-y-auto">
            <CardContent className="p-0">
              {/* Search Suggestions */}
              {inputValue.length > 0 && suggestions.length > 0 && (
                <div className="p-4 border-b">
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">
                    Suggestions
                  </h4>
                  <div className="space-y-1">
                    {suggestions.slice(0, 5).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-2 hover:bg-accent rounded-md transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{suggestion}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Searches */}
              {inputValue.length === 0 && recentSearches.length > 0 && (
                <div className="p-4 border-b">
                  <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Searches
                  </h4>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="w-full text-left p-2 hover:bg-accent rounded-md transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{search}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              {inputValue.length === 0 && popularSearches.length > 0 && (
                <div className="p-4">
                  <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Popular Searches
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleSuggestionClick(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* No results message */}
              {inputValue.length > 0 && suggestions.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No suggestions found for "{inputValue}"
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}