import { useState } from 'react';

const ProjectOrderList = ({ projects, onReorder }) => {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  if (!projects?.length) {
    return (
      <p className="rounded-xl border border-dashed border-line bg-white/60 px-4 py-6 text-center text-sm text-muted">
        No projects yet. Add projects first, then reorder them here.
      </p>
    );
  }

  const moveItem = (from, to) => {
    if (from === to || from == null || to == null) return;
    const next = [...projects];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onReorder(next);
  };

  return (
    <ul className="space-y-2">
      {projects.map((project, index) => {
        const isDragging = dragIndex === index;
        const isOver = overIndex === index && dragIndex !== index;

        return (
          <li
            key={project._id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragEnd={() => {
              setDragIndex(null);
              setOverIndex(null);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setOverIndex(index);
            }}
            onDrop={(event) => {
              event.preventDefault();
              moveItem(dragIndex, index);
              setDragIndex(null);
              setOverIndex(null);
            }}
            className={[
              'flex cursor-grab items-center gap-3 rounded-xl border bg-white px-3 py-3 text-sm transition active:cursor-grabbing',
              isDragging
                ? 'border-brand-400 opacity-60 shadow-sm'
                : isOver
                  ? 'border-brand-500 bg-brand-50/50'
                  : 'border-line hover:border-brand-300',
            ].join(' ')}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-xs font-semibold text-muted"
              aria-hidden="true"
            >
              ⋮⋮
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{project.title}</p>
              <p className="truncate text-xs text-muted">
                {project.shortDescription}
              </p>
            </div>
            <span className="shrink-0 text-[10px] font-semibold tracking-wider text-muted uppercase">
              #{index + 1}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default ProjectOrderList;
