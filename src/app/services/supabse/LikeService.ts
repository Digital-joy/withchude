import { supabase as client } from "../../../App";
import { ContentColumn } from "../../types";

export default class LikeService {
  async getLike(userId: string, contentId: string, column: ContentColumn) {
    // Step 1: Like the content
    const {data, error: relationError } = await client
      .from("likes")
      .select()
      .eq('user_id', userId)
      .eq(column, contentId)
      .single();

    if (relationError) {
      console.error("Error retrieving likes:", relationError);
      return null;
    }

    console.log("Like retrieved");
    return data;
  }

  async likeContent(userId: string, contentId: string, column: ContentColumn) {
    // Step 1: Like the content
    const {data, error: relationError } = await client
      .from("likes")
      .upsert(
        { user_id: userId, [`${column}`]: contentId },
        { onConflict: `user_id,${column}` }
      ).select();

    if (relationError) {
      console.error("Error liking content:", relationError);
      return null;
    }

    console.log("Content Liked");
    return data;
  }

  async unlikeContent(userId: string, contentId: string, column: ContentColumn) {
    // Step 1: Like the content
    const {data, error: relationError } = await client
      .from("likes")
      .delete()
      .eq('user_id', userId)
      .eq(column, contentId)
      .select();

    if (relationError) {
      console.error("Error liking content:", relationError);
      return null;
    }

    console.log("Content Liked");
    return data;
  }
}
