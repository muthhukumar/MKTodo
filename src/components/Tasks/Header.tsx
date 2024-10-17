import {TTask, TaskTypes} from "~/@types"
import {DesktopOnly, FeatureFlag, MobileOnly, SearchBar, Select} from ".."
import {TagFilter, DueDateFilter} from "."
import {Link} from "@tanstack/react-router"
import {IoSearchOutline} from "react-icons/io5"
import {TbSettings} from "react-icons/tb"
import {invariant} from "~/utils/invariants"

interface TaskHeaderProps {
  title: string
  //source?: string
  pendingTasks: TTask[]
  tasks: TTask[]
  tagFilterOptions: any[]
  setTagFilters: React.Dispatch<React.SetStateAction<string[]>>
  tagFilters: string[]
  showFilters?: boolean
  taskType: Exclude<TaskTypes, "planned:tomorrow" | "planned:today">
}

function TaskHeader(props: TaskHeaderProps) {
  const {
    title,
    //source = null,
    tagFilterOptions,
    pendingTasks,
    tasks,
    setTagFilters,
    tagFilters,
    showFilters,
    taskType,
  } = props
  invariant((taskType as string) !== "search", "Task type cannot be search. Got ", taskType)

  return (
    <div className="sticky top-0 py-1 left-0 right-0 bg-background z-10">
      <div className="flex items-center justify-between py-2 relative">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <span>
            {title}
            {/* <span className="font-normal text-xs ml-2">{source}</span> */}
          </span>
          <FeatureFlag feature="TasksCountInTitle">
            <FeatureFlag.Feature>
              <span className="font-normal text-xs px-2 py-1 rounded-md bg-hover-background">
                {pendingTasks.length} / {tasks.length}
              </span>
            </FeatureFlag.Feature>
          </FeatureFlag>
        </h1>
        <div className="flex items-center gap-3">
          <FeatureFlag feature="TagFilter">
            <FeatureFlag.Feature>
              <MobileOnly>
                <TagFilter
                  tags={tagFilterOptions}
                  setSelectedFilters={setTagFilters}
                  selectedFilters={tagFilters}
                />
              </MobileOnly>
            </FeatureFlag.Feature>
          </FeatureFlag>
          <FeatureFlag feature="TagFilter">
            <FeatureFlag.Feature>
              <DesktopOnly>
                <Select
                  data={tagFilterOptions}
                  setSelectedOptions={setTagFilters}
                  selectedOptions={tagFilters}
                />
              </DesktopOnly>
            </FeatureFlag.Feature>
          </FeatureFlag>
          <MobileOnly>
            <Link
              to="/search"
              search={{
                query: "",
              }}
            >
              <IoSearchOutline size={20} />
            </Link>
            {/*<MobileSearchBar />
             */}
            <Link to="/settings">
              <TbSettings size={21} />
            </Link>
          </MobileOnly>
        </div>
      </div>

      <DesktopOnly>
        <div className="hidden my-1">
          <SearchBar />
        </div>
      </DesktopOnly>
      {showFilters && <DueDateFilter />}
    </div>
  )
}

export default TaskHeader
