import { Injectable } from '@angular/core';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private tasksList: Task[] = [
    { id: 1, text: 'Сделать лабу по Angular', completed: false, createdAt: Date.now() - 3000 },
    { id: 2, text: 'Прочитать документацию', completed: true, createdAt: Date.now() - 2000 },
    { id: 3, text: 'Выпить кофе', completed: false, createdAt: Date.now() - 1000 }
  ];

  private nextId = 4;

  get tasks(): Task[] {
    return this.tasksList;
  }

  add(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    this.tasksList.push({
      id: this.nextId++,
      text: trimmed,
      completed: false,
      createdAt: Date.now()
    });
  }

  toggle(id: number): void {
    const task = this.tasksList.find(t => t.id === id);
    if (task) task.completed = !task.completed;
  }

  delete(id: number): void {
    this.tasksList = this.tasksList.filter(t => t.id !== id);
  }

  getFiltered(filter: string): Task[] {
    if (filter === 'active') return this.tasksList.filter(t => !t.completed);
    if (filter === 'completed') return this.tasksList.filter(t => t.completed);
    return this.tasksList;
  }

  sort(tasks: Task[], sortBy: string): Task[] {
    const copy = [...tasks];
    switch (sortBy) {
      case 'alpha-asc':
        return copy.sort((a, b) => a.text.localeCompare(b.text, 'ru'));
      case 'alpha-desc':
        return copy.sort((a, b) => b.text.localeCompare(a.text, 'ru'));
      case 'date-desc':
        return copy.sort((a, b) => b.createdAt - a.createdAt);
      case 'date-asc':
        return copy.sort((a, b) => a.createdAt - b.createdAt);
      default:
        return copy;
    }
  }
}