import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

const sampleReviews: Review[] = [
  {
    id: '1',
    userName: 'John M.',
    rating: 5,
    date: '2024-01-15',
    comment: 'Very effective for headaches. Fast relief and good value for money. Highly recommended!',
    helpful: 12,
    verified: true,
  },
  {
    id: '2',
    userName: 'Mary K.',
    rating: 4,
    date: '2024-01-10',
    comment: 'Good product, works as expected. Delivery was quick and packaging was secure.',
    helpful: 8,
    verified: true,
  },
  {
    id: '3',
    userName: 'David L.',
    rating: 5,
    date: '2024-01-05',
    comment: 'Excellent quality medicine. Have been using this brand for years and it never disappoints.',
    helpful: 15,
    verified: false,
  },
];

const ratingDistribution = [
  { stars: 5, count: 45, percentage: 60 },
  { stars: 4, count: 20, percentage: 27 },
  { stars: 3, count: 8, percentage: 11 },
  { stars: 2, count: 1, percentage: 1 },
  { stars: 1, count: 1, percentage: 1 },
];

export function ProductReviews({ productId, averageRating, totalReviews }: ProductReviewsProps) {
  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">{averageRating}</div>
              <div className="flex justify-center items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < Math.floor(averageRating)
                        ? 'fill-accent text-accent'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {totalReviews} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm">{rating.stars}</span>
                    <Star size={12} className="fill-accent text-accent" />
                  </div>
                  <Progress value={rating.percentage} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-8">
                    {rating.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review Button */}
      <div className="text-center">
        <Button variant="outline">
          <MessageCircle className="mr-2" size={16} />
          Write a Review
        </Button>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {sampleReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {review.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.userName}</span>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${
                                i < review.rating
                                  ? 'fill-accent text-accent'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <p className="text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>

                {/* Review Actions */}
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <ThumbsUp size={14} className="mr-1" />
                    Helpful ({review.helpful})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Reviews */}
      <div className="text-center">
        <Button variant="outline">
          Load More Reviews
        </Button>
      </div>
    </div>
  );
}