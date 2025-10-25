import { Dispatch, FC, SetStateAction } from "react";

interface Props {
  activeTab: "leaderboard" | "missions";
  setActiveTab: Dispatch<SetStateAction<"leaderboard" | "missions">>;
}

const LeaderBoardTab: FC<Props> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "leaderboard", label: "Leaderboard" },
    { id: "missions", label: "Missions" },
  ] as const;

  return (
    <div className=" ">
      {activeTab === "leaderboard" && (
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-mono text-main-text">
              PNL Leaderboard
            </h2>
            <p className="text-main-light-text text-lg md:text-xl max-w-2xl mt-2">
              Track the top traders and their performance in real-time
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderBoardTab;
