import { PostgrestBuilder, PostgrestSingleResponse } from "@supabase/postgrest-js";
import { supabase as client } from "../../../App";

export default class VideoService {
  async getUserStatsPerVideo(userId: string, videoId: string) {
    // Step 1: Like the video
    const { data, error: relationError } = await client
      .from("user_video_stats")
      .select("uid, user_id, video_id, views, seconds")
      .eq("user_id", userId)
      .eq("video_id", videoId)
      .single();

    if (relationError) {
      console.error("Error retrieving video stats:", relationError);
      return null;
    }

    return data;
  }
  async getUserVideoStat(uid: string) {
    // Step 1: Like the video
    const { data, error: relationError } = await client
      .from("user_video_stats")
      .select("uid, user_id, video_id, views, seconds")
      .eq("uid", uid)
      .single();

    if (relationError) {
      console.error("Error retrieving video stats:", relationError);
      return null;
    }

    return data;
  }

  async updateViews(userId: string, videoId: string) {
    const videoStat = await this.getUserStatsPerVideo(userId, videoId);
    let response;
    if (!videoStat) {
      response = await client
        .from("user_video_stats")
        .insert({ user_id: userId, video_id: videoId, views: 1 })
        .select();
    } else {
      response = await client
        .from("user_video_stats")
        .update({ views: videoStat.views + 1 })
        .eq("uid", videoStat.uid)
        .select();
    }
    const { data, relationError } = response;
    if (relationError) {
      console.error("Error liking video:", relationError);
      return null;
    }

    console.log("video views updated");
    return data;
  }

  async updateWatchTime(userId: string, videoId: string, seconds?: number, uid?: string) {
    seconds ??= 10;
    const videoStat = uid ? await this.getUserVideoStat(uid) : null;
    let response: PostgrestSingleResponse<{uid: any}>;
    if (!videoStat) {
      response = await client
        .from("user_video_stats")
        .insert({ user_id: userId, video_id: videoId, seconds: seconds })
        .select("uid")
        .single();
    } else {
      response = await client
        .from("user_video_stats")
        .update({ seconds: videoStat.seconds + seconds })
        .eq("uid", videoStat.uid)
        .select("uid")
        .single();
    }
    const { data, error: relationError } = response;
    if (relationError) {
      console.error("Error updating video watch time:", relationError);
      return null;
    }

    console.log("video watch time updated");
    return data;
  }
}
