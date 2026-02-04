import { supabase as client } from "../../../App";

export default class TagService {
  async create(name: string) {
    return client.from("tags").insert([{ name: name }]);
  }

  async attachTagToVideo(tagName: string, videoId: string) {
    // Step 1: Check if the tag exists or create it
    const { data: tag, error: tagError } = await client
      .from("tags")
      .upsert({ name: tagName }, { onConflict: "name" })
      .select()
      .single();

    if (tagError) {
      console.error("Error creating or retrieving tag:", tagError);
      return null;
    }

    const tagId = tag?.id;

    // Step 2: Attach the tag to the video
    const { error: relationError } = await client
      .from("video_tags")
      .upsert(
        { video_id: videoId, tag_id: tagId },
        { onConflict: "video_id,tag_id" }
      );

    if (relationError) {
      console.error("Error attaching tag to video:", relationError);
      return null;
    }

    console.log("Tag successfully attached to video");
    return { videoId, tagId };
  }
}
