import { supabase as client } from "../../../App";

export default class SurveyService {
  async getEnabledSurvey() {
    // Step 1: Like the content
    const {data, error: relationError } = await client
      .from("surveys")
      .select()
      .eq('enabled', true)
      .single();

    if (relationError) {
      console.error("Error retrieving surveys:", relationError);
      return null;
    }

    console.log("Survey retrieved");
    return data;
  }

  async submit(user_name: string, rating: number, user_id: string|null = null, device_id?: string, comment?: string, survey_id: string|null = null) {
    try {
      const { data, error } = await client
        .from("survey_responses")
        .insert({ user_id, user_name, rating, device_id, comment, survey_id })
        .select().single();

      if (error)
        throw new Error(`Error submitting response: ${error.message}`);
    } catch (error) {
      console.error(error.message);
      return { error: error.message };
    }
  }
}
