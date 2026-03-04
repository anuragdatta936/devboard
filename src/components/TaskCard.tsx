import { Task } from "@/types/task";

interface Props {
  task: Task;
  toggleTask: (id: string) => void;
}

export default function TaskCard({ task, toggleTask }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
      <h3
        className={`text-lg ${
          task.completed ? "line-through text-gray-400" : ""
        }`}
      >
        {task.title}
      </h3>

      <button
        onClick={() => toggleTask(task.id)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
      >
        {task.completed ? "Undo" : "Complete"}
      </button>
    </div>
  );
}