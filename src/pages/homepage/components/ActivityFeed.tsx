import React, { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import ActivityCard from "./ActivityCard";
import gsap from "gsap";

interface Activity {
  id: string;
  name: string;
  avatar: string;
  action: string;
  amount: string;
  token: string;
  price: string;
  timestamp: string;
  type: "buy" | "sell";
  walletAddress: string;
  tokenAddress: string;
  transactionHash: string;
  solSpent: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  feedRef: React.RefObject<HTMLDivElement>;
}

const ActivityFeed: React.FC<ActivityFeedProps> = React.memo(
  ({ activities, feedRef }) => {
    const localFeedRef = useRef<HTMLDivElement>(null);
    const prevActivitiesRef = useRef<Activity[]>([]);
    const newActivityIdsRef = useRef<Set<string>>(new Set());

    // Memoize the animation function
    const animateNewCards = useCallback((newActivityIds: string[]) => {
      newActivityIds.forEach((activityId) => {
        const newCardElement = document.getElementById(
          `activity-card-${activityId}`
        );
        if (newCardElement) {
          newCardElement.style.opacity = "0";
          newCardElement.style.transform = "translateY(10px)";

          gsap.to(newCardElement, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      });
    }, []);

    useEffect(() => {
      const currentRef = feedRef?.current || localFeedRef.current;

      if (currentRef) {
        // Immediately show the content, then animate
        currentRef.classList.remove("opacity-0");
        currentRef.classList.add("opacity-100");

        gsap.fromTo(
          currentRef,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          }
        );
      }
    }, [feedRef]);

    useEffect(() => {
      if (activities.length === 0) {
        prevActivitiesRef.current = [];
        newActivityIdsRef.current.clear();
        return;
      }

      if (prevActivitiesRef.current.length > 0) {
        const prevIds = new Set(prevActivitiesRef.current.map((a) => a.id));
        const newIds = activities
          .filter((activity) => !prevIds.has(activity.id))
          .map((activity) => activity.id);

        if (newIds.length > 0) {
          newActivityIdsRef.current = new Set(newIds);
          setTimeout(() => animateNewCards(newIds), 10);
        }
      }

      prevActivitiesRef.current = [...activities];
    }, [activities, animateNewCards]);

    const renderActivity = useCallback((activity: Activity, index: number) => {
      const isNewActivity = newActivityIdsRef.current.has(activity.id);

      return (
        <div
          key={activity.id}
          id={`activity-card-${activity.id}`}
          className={`transition-opacity duration-300 ${
            isNewActivity ? "opacity-0" : "opacity-100"
          }`}
        >
          <ActivityCard activity={activity} isFirst={index === 0} />
        </div>
      );
    }, []);

    return (
      <div className="relative bg-surface border border-subtle rounded-sm h-auto py-4 px-6 xl:py-6 xl:px-8 transition-all duration-500 shadow-elevated">
        <div className="flex items-center justify-between mb-4 xl:mb-6 relative z-10">
          <h2 className="font-algance text-xl xl:text-2xl text-main-text">
            Live KOL Activity
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 xl:w-4 xl:h-4 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-tiktok text-sm xl:text-base text-main-light-text">
              Live
            </span>
          </div>
        </div>
        <div
          ref={feedRef || localFeedRef}
          className="space-y-4 xl:space-y-5 relative z-10"
        >
          {activities.length > 0 ? (
            activities.map(renderActivity)
          ) : (
            <div className="text-center py-8">
              <div className="font-display text-main-light-text/60">
                No activity data available
              </div>
            </div>
          )}
        </div>
        <div className="text-center flex justify-center mt-8 xl:mt-10 relative z-10">
          <Link
            to="/leaderboard"
            className="relative overflow-hidden w-fit px-4 py-3 xl:px-6 xl:py-4 ml-4 z-50 transition-all flex gap-2 items-center ease-in shadow-2xl shadow-main-accent border border-main-accent/50 text-main-accent text-sm xl:text-base rounded-sm duration-300 cursor-pointer"
          >
            <span className="flex gap-2 items-center">
              View Full Leaderboard
            </span>
            <Icon
              icon="material-symbols:arrow-right-alt"
              className="ml-2 w-5 h-5 xl:w-6 xl:h-6"
            />
          </Link>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.activities === nextProps.activities) {
      return true;
    }

    if (prevProps.activities.length !== nextProps.activities.length) {
      return false;
    }

    const prevIds = prevProps.activities.map((a) => a.id);
    const nextIds = nextProps.activities.map((a) => a.id);

    for (let i = 0; i < prevIds.length; i++) {
      if (prevIds[i] !== nextIds[i]) {
        return false;
      }
    }

    return true;
  }
);

export default ActivityFeed;
