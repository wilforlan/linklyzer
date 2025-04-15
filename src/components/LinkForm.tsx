'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { LinkRecord } from '@/lib/supabase';
import { isValidUrl } from '@/lib/link-utils';

// Form validation schema
const formSchema = z.object({
  url: z.string().min(1, "URL is required").refine(isValidUrl, {
    message: "Please enter a valid URL",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LinkForm({ onSuccess }: { onSuccess: (data: { link: LinkRecord, shortUrl: string }) => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: values.url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create link');
      }

      // Call the success callback with the data
      onSuccess({
        link: data.link,
        shortUrl: data.shortUrl,
      });

      // Reset the form
      reset();
      toast.success('Your link has been created!');
    } catch (error) {
      console.error('Error creating link:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-grow">
            <input
              type="text"
              {...register('url')}
              className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.url ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-gray-800`}
              placeholder="Enter your URL (e.g., https://example.com)"
              disabled={isLoading}
            />
            {errors.url && (
              <p className="mt-1 text-sm text-red-500">{errors.url.message}</p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-6 py-3 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium text-lg 
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing
              </span>
            ) : (
              "Generate Link"
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
} 