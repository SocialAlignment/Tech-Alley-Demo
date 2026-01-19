import { supabase } from './supabase';
import { ExtendedSpeaker } from '@/components/SpeakerDrawer';

export async function getTonightLineup(): Promise<ExtendedSpeaker[]> {
    const { data, error } = await supabase
        .from('tonight_lineup')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching lineup:', error);
        return [];
    }

    if (!data) return [];

    return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        title: row.title,
        company: row.company || '',
        image: row.image_url || '',
        promoImage: row.promo_image_url,
        imageClassName: row.image_class_name,

        // Arrays & Complex Objects
        topics: row.topics || [],
        socials: row.socials || {},

        // Bio & Narrative
        bioShort: row.bio_short,
        bioFull: row.bio_full,
        quote: row.quote,
        industry: row.industry,
        valueProposition: row.value_proposition,

        // Session
        sessionTitle: row.session_title,
        sessionAbstract: row.session_abstract,

        // Links
        landingPage: row.landing_page_url,
        deckLink: row.deck_link,
        resourceLink: row.resource_link,

        // Meta
        status: (row.status as any) || 'complete',
        completion: row.completion_percentage || 0
    }));
}
