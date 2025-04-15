'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { LinkRecord } from '@/lib/supabase';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface LinkResultProps {
  link: LinkRecord;
  shortUrl: string;
}

export default function LinkResult({ link, shortUrl }: LinkResultProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy link');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mt-8"
    >
      <Card className="border-2 border-primary-200 dark:border-primary-900 shadow-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Your tracked link is ready!</h3>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs px-2 py-1 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                  Created {new Date(link.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm font-medium flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
                {shortUrl}
              </div>
              <Button 
                variant={copied ? "outline" : "default"}
                size="sm"
                onClick={copyToClipboard}
                className="whitespace-nowrap"
              >
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Original URL: <span className="font-medium truncate block">{link.originalUrl}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex flex-col sm:flex-row gap-3 items-center">
          <Link href={`/dashboard/${link.shortId}`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              View Analytics
            </Button>
          </Link>
          <Link href={`/api/links/${link.shortId}`} target="_blank" className="w-full sm:w-auto">
            <Button className="w-full" variant="secondary">
              Test Link
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 