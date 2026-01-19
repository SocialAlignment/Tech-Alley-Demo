"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getQuestions, submitFeedback, markQuestionAsAnswered } from '@/lib/api';
import { supabase } from '@/lib/supabase';

export interface Question {
    id: string;
    speakerId: string;
    from: string;
    topic: string;
    content: string;
    timestamp: number;
    is_answered?: boolean;
}

interface QuestionsContextType {
    questions: Question[];
    addQuestion: (question: Omit<Question, 'id' | 'timestamp'>) => Promise<void>;
    getQuestionsBySpeakerId: (speakerId: string) => Question[];
    markAsAnswered: (questionId: string) => Promise<void>;
    refreshQuestions: (speakerId: string) => Promise<void>;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export function QuestionsProvider({ children }: { children: ReactNode }) {
    const [questions, setQuestions] = useState<Question[]>([]);

    // Function to fetch all questions (could be optimized to be per-speaker on demand)
    const loadQuestions = async (speakerId?: string) => {
        // Ideally we load for all relevant speakers or dynamically
        // For now, let's look for known speakers ID 1, 2, 4
        // Or better yet, we just listen to ALL questions from the DB
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .eq('type', 'question')
            .eq('is_answered', false)
            .eq('is_answered', false)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching questions in Context:', error);
        }

        if (data) {
            const mapped: Question[] = data.map(q => ({
                id: q.id,
                speakerId: q.speaker_id,
                from: q.visitor_name || 'Anonymous',
                topic: q.topic,
                content: q.content,
                timestamp: new Date(q.created_at).getTime(),
            }));
            setQuestions(mapped);
        }
    };

    // Initial Load
    useEffect(() => {
        loadQuestions();

        // Subscription for real-time updates
        const channel = supabase
            .channel('public:feedback')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback' }, (payload) => {
                console.log('Real-time update:', payload);
                loadQuestions();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const addQuestion = async (newQuestion: Omit<Question, 'id' | 'timestamp'>) => {
        // Optimistic update
        const tempId = Math.random().toString(36).substr(2, 9);
        const question: Question = {
            ...newQuestion,
            id: tempId,
            timestamp: Date.now(),
        };
        setQuestions((prev) => [question, ...prev]);

        // Submit to DB
        await submitFeedback({
            speaker_id: newQuestion.speakerId,
            speaker_name: 'Unknown', // We might need this prop or lookup
            visitor_name: newQuestion.from,
            topic: newQuestion.topic,
            content: newQuestion.content,
            type: 'question'
        });

        // The real-time subscription will eventually replace this with the real unique ID record
    };

    const markAsAnswered = async (questionId: string) => {
        // Optimistic removal
        setQuestions((prev) => prev.filter(q => q.id !== questionId));
        await markQuestionAsAnswered(questionId);
    };

    const getQuestionsBySpeakerId = (speakerId: string) => {
        return questions.filter((q) => q.speakerId === speakerId);
    };

    return (
        <QuestionsContext.Provider value={{ questions, addQuestion, getQuestionsBySpeakerId, markAsAnswered, refreshQuestions: loadQuestions }}>
            {children}
        </QuestionsContext.Provider>
    );
}

export function useQuestions() {
    const context = useContext(QuestionsContext);
    if (context === undefined) {
        throw new Error('useQuestions must be used within a QuestionsProvider');
    }
    return context;
}
