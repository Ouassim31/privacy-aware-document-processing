import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
export const { IExec } = require("iexec");

function TaskBtn(props) {
  const { task_id, processid, getResult } = props;
  const handleResults = (tid) => {
    getResult(tid);
  };
  const [taskState, setTaskState] = useState("UNSET");

  const waitFinalState = async (taskid) => {
    const iexec_mod = new IExec({ ethProvider: window.ethereum });
    const taskObservable = await iexec_mod.task.obsTask(taskid);
    const unsubscribe = taskObservable.subscribe({
      next: ({ task }) => setTaskState(task.statusName),
      error: (e) => console.error(e),
      complete: () => console.log("final state reached"),
    });
  };
  useEffect(() => {
    waitFinalState(task_id);
  }, []);
  return (
    <Button
      variant={taskState === "COMPLETED" ? "success" : "outline-warning"}
      processid={processid}
      onClick={(e) => {
        if (taskState == "COMPLETED") {
          task_id && handleResults(task_id);
        }
      }}
    >
      {taskState}
    </Button>
  );
}
export default TaskBtn;
