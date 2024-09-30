import {describe, expect, it} from "vitest"
import {
  extractTags,
  extractTaskTags,
  NewTask,
  createTask,
  MyDayTask,
  ImportantTask,
  PlannedTask,
} from "."
import {getTodayDate, getTomorrowDate} from "../date"

describe("extractTags", () => {
  it("should return empty array if the passed string is empty", () => {
    expect(extractTags("")).toStrictEqual({
      modifiedStr: "",
      tags: [],
    })
  })

  it("should return p1 if the string passed is !p1", () => {
    expect(extractTags("!p1")).toStrictEqual({
      modifiedStr: "",
      tags: ["p1"],
    })
  })

  it("should return p1, p2, feature, bug if the string passed is `!p1 !p2, !feature, !bug`", () => {
    expect(extractTags("This is a !p1 and !p2 is of !feature and has !bug")).toStrictEqual({
      modifiedStr: "This is a  and  is of  and has ",
      tags: ["p1", "p2", "feature", "bug"],
    })
  })

  it("should return the same str if the string passed does not have any tag", () => {
    expect(extractTags("This is just a normal string")).toStrictEqual({
      modifiedStr: "This is just a normal string",
      tags: [],
    })
  })
})

describe("extractTaskTags", () => {
  it("should return null if there is no tags in the passed string", () => {
    expect(extractTaskTags("")).toBeNull()
  })
  it("should return null if there is tags in the string but the task is not task tags", () => {
    expect(extractTaskTags("!feature !bug")).toBeNull()
  })
  it("should return the first task tag that matches", () => {
    expect(extractTaskTags("!feature !bug !myday !important !all")).toStrictEqual({
      modifiedStr: "     !feature !bug !important !all",
      taskType: "myday",
    })
  })
})

describe("NewTask", () => {
  it("New Task should have metadata as empty string and name should be whatever is passed", () => {
    const task = new NewTask("This is a task")

    expect(task.name).toBe("This is a task")
    expect(task.metadata).toBe("")
  })

  it("should extract the feature tag from the taskname and set it to metadata", () => {
    const task = new NewTask("!feature This is a task")

    expect(task.name).toBe(" This is a task")
    expect(task.metadata).toBe("feature")
  })

  it("should not set the !my-day tag in the metadata as it is task type", () => {
    const task = new NewTask("!myday This is a task")

    expect(task.name).toBe(" This is a task")
    expect(task.metadata).toBe("")
  })

  it("should not set the !my-day tag in the metadata but it should set normal tag", () => {
    const task = new NewTask("!myday !feature This is a task")

    expect(task.name).toBe("  This is a task")
    expect(task.metadata).toBe("feature")
  })
})

describe("createTask", () => {
  it("should return my day task instance if the taskType is my-day", () => {
    const task = createTask("my-day", "This is a normal task")

    expect(task instanceof MyDayTask).toBeTruthy()
  })

  it("should return important task if the task type is important", () => {
    const task = createTask("important", "This is a normal task")

    expect(task instanceof ImportantTask).toBeTruthy()

    if (task instanceof ImportantTask) {
      expect(task.is_important).toBeTruthy()
    }
  })

  it("should return Planned task if the task type is Planned:today", () => {
    const task = createTask("planned:today", "This is a normal task")

    expect(task instanceof PlannedTask).toBeTruthy()

    if (task instanceof PlannedTask) {
      expect(task.due_date).toBe(getTodayDate())
    }
  })

  it("should return Planned task if the task type is Planned:tomorrow", () => {
    const task = createTask("planned:tomorrow", "This is a normal task")

    expect(task instanceof PlannedTask).toBeTruthy()

    if (task instanceof PlannedTask) {
      expect(task.due_date).toBe(getTomorrowDate())
    }
  })

  describe("TaskType is empty. But the task type is in tag", () => {
    it("should return my day task instance if the tag is my-day", () => {
      const task = createTask("", "!myday This is a normal task")

      expect(task instanceof MyDayTask).toBeTruthy()
    })

    it("should return important task if the tag is important", () => {
      const task = createTask("", "!important This is a normal task")

      expect(task instanceof ImportantTask).toBeTruthy()

      if (task instanceof ImportantTask) {
        expect(task.is_important).toBeTruthy()
      }
    })

    it("should return Planned task if the tag is today", () => {
      const task = createTask("", "!today This is a normal task")

      expect(task instanceof PlannedTask).toBeTruthy()

      if (task instanceof PlannedTask) {
        expect(task.due_date).toBe(getTodayDate())
      }
    })

    it("should return Planned task if the tag is tomorrow", () => {
      const task = createTask("", "!tomorrow This is a normal task")

      expect(task instanceof PlannedTask).toBeTruthy()

      if (task instanceof PlannedTask) {
        expect(task.due_date).toBe(getTomorrowDate())
      }
    })
  })
})
