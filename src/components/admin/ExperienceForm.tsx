'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createExperience, updateExperience } from '@/lib/experiences/actions';
import { useRouter } from 'next/navigation';

// Define form validation schema
const experienceSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  short_description: z.string().min(10, 'Short description must be at least 10 characters'),
  location: z.string().min(3, 'Location is required'),
  category: z.string().min(3, 'Category is required'),
  price: z.number().positive('Price must be positive'),
  duration: z.number().int().positive('Duration must be a positive number'),
  difficulty: z.enum(['Easy', 'Moderate', 'Challenging']),
  max_participants: z.number().int().positive('Maximum participants must be a positive number'),
  image_urls: z.array(z.string().url()).min(1, 'At least one image is required'),
  is_active: z.boolean().default(true),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  initialData?: ExperienceFormValues;
  experienceId?: string;
}

export default function ExperienceForm({ initialData, experienceId }: ExperienceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isEditing = !!experienceId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      short_description: '',
      location: '',
      category: '',
      price: 0,
      duration: 0,
      difficulty: 'Moderate',
      max_participants: 1,
      image_urls: [''],
      is_active: true,
    },
  });

  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.image_urls || ['']);

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index: number) => {
    const newUrls = [...imageUrls];
    newUrls.splice(index, 1);
    setImageUrls(newUrls);
    setValue('image_urls', newUrls);
  };

  const onSubmit = async (data: ExperienceFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Filter out empty image URLs
      data.image_urls = data.image_urls.filter(url => url.trim() !== '');
      
      if (isEditing) {
        await updateExperience(experienceId, data);
      } else {
        await createExperience(data);
      }
      
      router.push('/admin/experiences');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            id="location"
            type="text"
            {...register('location')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>
        
        {/* Short Description */}
        <div className="md:col-span-2">
          <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">
            Short Description
          </label>
          <input
            id="short_description"
            type="text"
            {...register('short_description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
          {errors.short_description && (
            <p className="mt-1 text-sm text-red-600">{errors.short_description.message}</p>
          )}
        </div>
        
        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Full Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          >
            <option value="Desert Adventures">Desert Adventures</option>
            <option value="Aquatic Experiences">Aquatic Experiences</option>
            <option value="Aerial Activities">Aerial Activities</option>
            <option value="Cultural Experiences">Cultural Experiences</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>
        
        {/* Difficulty */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
            Difficulty
          </label>
          <select
            id="difficulty"
            {...register('difficulty')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          >
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Challenging">Challenging</option>
          </select>
          {errors.difficulty && (
            <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
          )}
        </div>
        
        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price (TND)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>
        
        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (minutes)
          </label>
          <input
            id="duration"
            type="number"
            {...register('duration', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
          )}
        </div>
        
        {/* Max Participants */}
        <div>
          <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700">
            Maximum Participants
          </label>
          <input
            id="max_participants"
            type="number"
            {...register('max_participants', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
          {errors.max_participants && (
            <p className="mt-1 text-sm text-red-600">{errors.max_participants.message}</p>
          )}
        </div>
        
        {/* Is Active */}
        <div>
          <div className="flex items-center">
            <input
              id="is_active"
              type="checkbox"
              {...register('is_active')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm font-medium text-gray-700">
              Active (visible to users)
            </label>
          </div>
        </div>
      </div>
      
      {/* Image URLs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image URLs
        </label>
        <div className="space-y-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                {...register(`image_urls.${index}` as const)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              />
              <button
                type="button"
                onClick={() => removeImageUrl(index)}
                className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                disabled={imageUrls.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addImageUrl}
            className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Another Image
          </button>
        </div>
        {errors.image_urls && (
          <p className="mt-1 text-sm text-red-600">{errors.image_urls.message}</p>
        )}
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            isEditing ? 'Update Experience' : 'Create Experience'
          )}
        </button>
      </div>
    </form>
  );
}