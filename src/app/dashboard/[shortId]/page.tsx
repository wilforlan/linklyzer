'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LinkRecord } from '@/lib/supabase';

// Define analytics data structure
interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  devices: Record<string, number>;
  countries: Record<string, number>;
  referers: Record<string, number>;
  visits: {
    timestamp: string;
    device: string | null;
    country: string | null;
    city: string | null;
  }[];
}

interface DashboardData {
  link: LinkRecord;
  analytics: AnalyticsData;
}

export default function LinkDashboard() {
  const params = useParams();
  const router = useRouter();
  const shortId = params.shortId as string;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/links/${shortId}/analytics`);
        
        if (!res.ok) {
          if (res.status === 404) {
            setError('Link not found or has been deleted');
            router.push('/');
            return;
          }
          throw new Error('Failed to fetch analytics data');
        }
        
        const data = await res.json();
        setData(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load analytics');
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [shortId, router]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this link? This action cannot be undone.')) {
      setDeleting(true);
      try {
        const res = await fetch(`/api/links/${shortId}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) {
          throw new Error('Failed to delete link');
        }
        
        toast.success('Link deleted successfully');
        router.push('/');
      } catch (err) {
        console.error('Error deleting link:', err);
        toast.error('Failed to delete link');
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Toaster position="top-right" />
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          
          <Skeleton className="h-64 mb-8" />
          <Skeleton className="h-44" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Toaster position="top-right" />
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-lg mb-6">{error}</p>
        <Button onClick={() => router.push('/')}>Return Home</Button>
      </div>
    );
  }

  if (!data) return null;

  const { link, analytics } = data;
  const formattedDate = new Date(link.createdAt).toLocaleDateString();

  return (
    <div className="container mx-auto px-4 py-16">
      <Toaster position="top-right" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Tracking data for your shortened link
            </p>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Link'}
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Link Information</CardTitle>
            <CardDescription>Details about your tracked link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-semibold">Original URL:</span>
              <p className="break-all">{link.originalUrl}</p>
            </div>
            <div>
              <span className="font-semibold">Short Link:</span>
              <div className="flex gap-2 items-center mt-1">
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                  {window.location.origin}/links/{link.shortId}
                </code>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/links/${link.shortId}`);
                    toast.success('Link copied to clipboard!');
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
            <div>
              <span className="font-semibold">Created:</span>
              <p>{formattedDate}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{analytics.totalVisits}</CardTitle>
              <CardDescription>Total Visits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                All-time clicks on your link
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{analytics.uniqueVisitors}</CardTitle>
              <CardDescription>Unique Visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Based on unique IP addresses
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {Object.keys(analytics.devices).length}
              </CardTitle>
              <CardDescription>Different Devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Platforms that accessed your link
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="visits" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="visits">Recent Visits</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="referers">Referrers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visits">
            <Card>
              <CardHeader>
                <CardTitle>Visit History</CardTitle>
                <CardDescription>Recent visits to your link</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.visits.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No visits recorded yet
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {analytics.visits.map((visit, index) => (
                      <div 
                        key={index}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(visit.timestamp).toLocaleString()}
                          </div>
                          {visit.device && (
                            <Badge variant="outline">{visit.device}</Badge>
                          )}
                        </div>
                        {(visit.country || visit.city) && (
                          <div className="text-sm">
                            Location: {visit.city ? `${visit.city}, ` : ''}{visit.country || 'Unknown'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Types of devices accessing your link</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(analytics.devices).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No device data available
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(analytics.devices).map(([device, count]) => (
                      <div key={device} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{device}</Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {count} visit{count !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="w-32 bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                          <div
                            className="bg-primary-600 h-2.5 rounded-full"
                            style={{ width: `${(count / analytics.totalVisits) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Locations</CardTitle>
                <CardDescription>Countries where your link was accessed</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(analytics.countries).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No location data available
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(analytics.countries).map(([country, count]) => (
                      <div key={country} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{country}</Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {count} visit{count !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="w-32 bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                          <div
                            className="bg-primary-600 h-2.5 rounded-full"
                            style={{ width: `${(count / analytics.totalVisits) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="referers">
            <Card>
              <CardHeader>
                <CardTitle>Referral Sources</CardTitle>
                <CardDescription>Where visitors came from</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(analytics.referers).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No referrer data available
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(analytics.referers).map(([referer, count]) => (
                      <div key={referer} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {referer.length > 40 ? referer.substring(0, 40) + '...' : referer}
                          </Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {count} visit{count !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="w-32 bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                          <div
                            className="bg-primary-600 h-2.5 rounded-full"
                            style={{ width: `${(count / analytics.totalVisits) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Testing</CardTitle>
            <CardDescription>Try out your link or share it</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => window.open(`/links/${link.shortId}`, '_blank')}
              className="flex-1"
            >
              Test Link
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/links/${link.shortId}`);
                toast.success('Link copied to clipboard!');
              }}
              className="flex-1"
            >
              Copy Link
            </Button>
            <Button 
              variant="secondary"
              onClick={() => router.push('/')}
              className="flex-1"
            >
              Create New Link
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 