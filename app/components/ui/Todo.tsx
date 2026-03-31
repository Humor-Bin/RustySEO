import React, { useState, useEffect } from "react";
import {
  Container,
  TextInput,
  MultiSelect,
  Select,
  Button,
  Box,
  Drawer,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import TodoItems from "./TodoItems";
import { updateTasks } from "@/app/Hooks/taskUtils";
import { toast } from "sonner";
import { zhCN } from "@/app/utils/zhCN";

type Task = {
  id: number;
  title: string;
  description: string;
  type: string[];
  priority: string;
  url: string | null;
  date: string;
  status: string;
  strategy: string;
};

const taskTypes = [
  "CWV",
  zhCN.page.todo.taskTypes.head,
  zhCN.page.todo.taskTypes.content,
  zhCN.page.todo.taskTypes.links,
  zhCN.page.todo.taskTypes.images,
  zhCN.page.todo.taskTypes.headings,
  zhCN.page.todo.taskTypes.keywords,
  zhCN.page.todo.taskTypes.schema,
];
const priorities = [
  zhCN.page.todo.priorities.low,
  zhCN.page.todo.priorities.medium,
  zhCN.page.todo.priorities.high,
];

interface TodoProps {
  url: string;
  close: () => void;
  strategy: string;
}

const Todo: React.FC<TodoProps> = ({ strategy, url, close: closeModal }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksInitialized, setTasksInitialized] = useState(false);
  const [opened, { toggle }] = useDisclosure(false);
  const [recrawlUrl, setRecrawlUrl] = useState<string | null>(null);

  const [newTask, setNewTask] = useState<Task>({
    id: Math.random() * 100000,
    title: "",
    description: "",
    type: [],
    priority: "",
    url: url,
    date: new Date().toISOString(),
    status: zhCN.page.todo.statuses.todo,
    strategy: strategy || "DESKTOP",
  });

  useEffect(() => {
    const recrawl = sessionStorage.getItem("url");
    setRecrawlUrl(recrawl);
  }, []);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      console.log("Loading tasks from localStorage", JSON.parse(storedTasks));
      setTasks(JSON.parse(storedTasks));
    }
    setTasksInitialized(true);
  }, []);

  useEffect(() => {
    if (tasksInitialized) {
      console.log("Saving tasks to localStorage", tasks);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, tasksInitialized]);

  const handleAddTask = () => {
    if (newTask.title && newTask.type.length > 0 && newTask.priority) {
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setNewTask({
        id: Math.random() * 100000,
        title: "",
        description: "",
        type: [],
        priority: "",
        url: url,
        date: new Date().toISOString(),
        status: zhCN.page.todo.statuses.todo,
        strategy,
      });
      const event = new Event("tasksUpdated");
      window.dispatchEvent(event);
      console.log("Task added", updatedTasks);
      updateTasks(updatedTasks);
      closeModal();
      toast(zhCN.page.todo.taskAdded);
    } else {
      toast.error(zhCN.page.todo.requiredFields);
    }
  };

  return (
    <>
      <Drawer
        offset={8}
        radius="md"
        opened={opened}
        onClose={closeModal}
        title={zhCN.page.todo.drawerTitle}
        size="sm"
        className="overflow-hidden"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        transitionProps={{
          transition: "scale-x",
          duration: 200,
          timingFunction: "ease",
        }}
        position="left"
        withCloseButton
        closeOnClickOutside
      >
        <TodoItems url={url} strategy={strategy} />
      </Drawer>

      <Container size="sm">
        <Box>
          <Box mb="lg">
            <TextInput
              label={zhCN.page.todo.labels.title}
              placeholder={zhCN.page.todo.placeholders.title}
              className="dark:text-white"
              value={newTask.title}
              onChange={(event) =>
                setNewTask({ ...newTask, title: event.currentTarget.value })
              }
              mb="md"
            />
            <TextInput
              label={zhCN.page.todo.labels.description}
              placeholder={zhCN.page.todo.placeholders.description}
              className="dark:text-white"
              value={newTask.description}
              onChange={(event) =>
                setNewTask({
                  ...newTask,
                  description: event.currentTarget.value,
                })
              }
              mb="md"
            />
            <MultiSelect
              label={zhCN.page.todo.labels.type}
              placeholder={zhCN.page.todo.placeholders.type}
              className="dark:text-white text-black"
              data={taskTypes.map((type) => ({ value: type, label: type }))}
              value={newTask.type}
              onChange={(value) => setNewTask({ ...newTask, type: value })}
              mb="md"
              maxDropdownHeight={200}
              comboboxProps={{
                transitionProps: { transition: "pop", duration: 200 },
                shadow: "md",
              }}
            />
            <Select
              label={zhCN.page.todo.labels.priority}
              placeholder={zhCN.page.todo.placeholders.priority}
              className="dark:text-white"
              data={priorities.map((priority) => ({
                value: priority,
                label: priority,
              }))}
              value={newTask.priority}
              onChange={(value) =>
                setNewTask({ ...newTask, priority: value || "" })
              }
              mb="md"
              comboboxProps={{
                transitionProps: { transition: "pop", duration: 200 },
                shadow: "md",
              }}
            />
            <TextInput
              className="dark:text-white dark:placeholder:text-white"
              label={zhCN.page.todo.labels.pageUrl}
              placeholder={!url && !recrawlUrl ? "" : url || recrawlUrl || ""}
              value={url || recrawlUrl || "..."}
              readOnly
            />
            <Button className="mt-4 w-full" fullWidth onClick={handleAddTask}>
              {zhCN.page.todo.addTask}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Todo;
