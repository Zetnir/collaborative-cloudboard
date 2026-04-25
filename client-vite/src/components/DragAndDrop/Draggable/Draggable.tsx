import { useDraggable } from "@dnd-kit/react";

interface DraggableProps {
  id: string;
  status: string;
}

export function Draggable(props: DraggableProps) {
  const { ref } = useDraggable({
    id: props.id,
  });

  return (
    <div
      ref={ref}
      className="btn btn-primary"
      style={{ width: "300px", height: "200px" }}
    >
      <h6>Task : {props.status}</h6>
      <span>
        Task description : Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Sed vitae sapien vel augue fermentum varius et non justo.
      </span>
      <br />
      <span>Creation date</span>
    </div>
  );
}
