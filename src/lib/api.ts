
import { supabase } from './supabase';

export interface FeedbackSubmission {
    speaker_id: string;
    speaker_name: string;
    visitor_name?: string;
    topic: string;
    content: string;
    type: 'question' | 'feedback';
}

export async function submitFeedback(data: FeedbackSubmission) {
    console.log('Submitting to Supabase:', data);

    // Attempt to insert into a 'feedback' table
    // If table doesn't exist or RLS fails, this will return an error
    const { error } = await supabase
        .from('feedback')
        .insert([
            {
                speaker_id: data.speaker_id,
                speaker_name: data.speaker_name,
                visitor_name: data.visitor_name,
                topic: data.topic,
                content: data.content,
                type: data.type,
                created_at: new Date().toISOString(),
            }
        ]);

    if (error) {
        console.error('Supabase error:', error);
        throw error;
    }

    return true;
}

export async function getQuestions(speakerId: string) {
    const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('speaker_id', speakerId)
        .eq('type', 'question')
        .eq('is_answered', false) // Only get unanswered questions
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching questions:', error);
        return [];
    }

    return data || [];
}

export async function markQuestionAsAnswered(questionId: string) {
    // Assuming 'feedback' table has an 'is_answered' boolean column
    // If not, we might need to add it or soft-delete
    const { error } = await supabase
        .from('feedback')
        .update({ is_answered: true })
        .eq('id', questionId);

    if (error) {
        console.error('Error marking question as answered:', error);
        throw error;
    }
    return true;
}
