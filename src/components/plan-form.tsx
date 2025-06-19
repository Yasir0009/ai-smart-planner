"use client";

import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, Trash2, RotateCcw, Send } from 'lucide-react';
import type { GeneratePlanInput } from '@/ai/flows/generate-plan';

const planningTopics = ["Study", "Fitness", "Work", "Life Tasks"] as const;
const planDurations = ["Daily", "Weekly", "Monthly", "Yearly"] as const;

const formSchema = z.object({
  planningTopic: z.enum(planningTopics, {
    required_error: "Planning topic is required.",
  }),
  tasks: z.array(z.object({ name: z.string().min(1, "Task name cannot be empty.") })).min(1, "At least one task is required."),
  availableTime: z.string().min(1, "Available time is required."),
  planDuration: z.enum(planDurations, {
    required_error: "Plan duration is required.",
  }),
  customGoals: z.string().optional(),
});

type PlanFormValues = z.infer<typeof formSchema>;

interface PlanFormProps {
  onSubmit: (data: GeneratePlanInput) => void;
  isLoading: boolean;
}

export function PlanForm({ onSubmit, isLoading }: PlanFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planningTopic: undefined,
      tasks: [{ name: '' }],
      availableTime: '',
      planDuration: undefined,
      customGoals: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  const handleFormSubmit = (data: PlanFormValues) => {
    const GenaipPrams: GeneratePlanInput = {
        ...data,
        tasks: data.tasks.map(task => task.name),
    }
    onSubmit(GenaipPrams);
  };

  const handleReset = () => {
    reset({
      planningTopic: undefined,
      tasks: [{ name: '' }],
      availableTime: '',
      planDuration: undefined,
      customGoals: '',
    });
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create Your Plan</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="planningTopic">Planning Topic</Label>
              <Controller
                name="planningTopic"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <SelectTrigger id="planningTopic">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {planningTopics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.planningTopic && <p className="text-sm text-destructive mt-1">{errors.planningTopic.message}</p>}
            </div>
            <div>
              <Label htmlFor="planDuration">Plan Duration</Label>
              <Controller
                name="planDuration"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <SelectTrigger id="planDuration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {planDurations.map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.planDuration && <p className="text-sm text-destructive mt-1">{errors.planDuration.message}</p>}
            </div>
          </div>

          <div>
            <Label>Tasks</Label>
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2 mb-2">
                <Controller
                  name={`tasks.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder={`Task ${index + 1}`} className="flex-grow" />
                  )}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '' })} className="mt-1">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
            {errors.tasks && <p className="text-sm text-destructive mt-1">{errors.tasks.message || errors.tasks.root?.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="availableTime">Time Available Per Day</Label>
            <Controller
              name="availableTime"
              control={control}
              render={({ field }) => <Input {...field} id="availableTime" placeholder="e.g., 2 hours, 30 minutes" />}
            />
            {errors.availableTime && <p className="text-sm text-destructive mt-1">{errors.availableTime.message}</p>}
          </div>

          <div>
            <Label htmlFor="customGoals">Custom Goals (Optional)</Label>
            <Controller
              name="customGoals"
              control={control}
              render={({ field }) => <Textarea {...field} id="customGoals" placeholder="e.g., Read one book this month, meditate for 10 mins daily" />}
            />
            {errors.customGoals && <p className="text-sm text-destructive mt-1">{errors.customGoals.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-6">
          <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Plan'} <Send className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
