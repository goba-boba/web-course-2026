import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService, Task } from './todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  newTaskText = '';
  filter: 'all' | 'active' | 'completed' = 'all';
  sortBy: 'default' | 'alpha-asc' | 'alpha-desc' | 'date-desc' | 'date-asc' = 'default';

  constructor(public todoService: TodoService) {}

  addTask(): void {
    if (this.newTaskText.trim()) {
      this.todoService.add(this.newTaskText);
      this.newTaskText = '';
    }
  }

  toggleTask(id: number): void {
    this.todoService.toggle(id);
  }

  deleteTask(id: number): void {
    this.todoService.delete(id);
  }

  setFilter(f: 'all' | 'active' | 'completed'): void {
    this.filter = f;
  }

  setSort(value: string): void {
    this.sortBy = value as typeof this.sortBy;
  }

  get filteredTasks(): Task[] {
    const filtered = this.todoService.getFiltered(this.filter);
    return this.todoService.sort(filtered, this.sortBy);
  }

  get total(): number {
    return this.todoService.tasks.length;
  }

  get completedCount(): number {
    return this.todoService.tasks.filter(t => t.completed).length;
  }

  get remainingCount(): number {
    return this.total - this.completedCount;
  }
}