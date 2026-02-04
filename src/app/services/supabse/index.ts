import ActivityService from './ActivityService';
import LikeService from './LikeService';
import PaymentService from './PaymentService';
import SurveyService from './SurveyService';
import TagService from './TagService';
import VideoService from './VideoService';

// SERVICE CONTAINERS
export const tagService = new TagService();
export const surveyService = new SurveyService();
export const likeService = new LikeService();
export const paymentService = new PaymentService();
export const videoService = new VideoService();
export const activityService = new ActivityService();