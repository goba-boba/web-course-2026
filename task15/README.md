# Лабораторная работа №15 — Todo-list на Angular

Мини-проект на Angular: Todo-list с фильтрами и сортировкой. 
Переписан с React-версии (лабораторные №10–11).

**Автор:** Лапунова Арина Сергеевна, группа 11

## Запуск

cd /d D:\web-course-2026\task15
npm install
npm start

Открой в браузере: http://localhost:4200

## Структура

- src/app/app.ts — главный компонент (аналог App в React)
- src/app/app.html — шаблон
- src/app/app.css — стили (аврора-фон, стеклянная карточка, кастомный чекбокс)
- src/app/todo.service.ts — сервис с логикой задач
- src/main.ts — точка входа (bootstrap)
- src/app/app.config.ts — конфиг приложения

## Что реализовано

- Один компонент App со свойствами (newTaskText, filter, sortBy) и методами 
  (addTask, toggleTask, deleteTask, setFilter, setSort)
- Двустороннее связывание [(ngModel)] для поля ввода и селекта сортировки
- *ngFor для рендера списка задач
- *ngIf для условного отображения (сообщение «Задач нет»)
- Сервис TodoService с @Injectable({providedIn: 'root'}) — хранит задачи и содержит 
  всю логику (добавление, удаление, переключение, фильтрация, сортировка). 
  Внедряется в компонент через конструктор (Dependency Injection).

## Сравнение Angular и React

В React состояние (массив задач) живёт прямо в компоненте через useState, а 
дочерние компоненты получают его через props. В Angular состояние вынесено в 
отдельный класс-сервис TodoService, а компонент получает его через конструктор 
(DI). Мне показалось привычнее в React — там всё в одном файле, и сразу видно, 
где живут данные. В Angular приходится держать в голове, что сервис — это 
синглтон (один экземпляр на всё приложение), и что компонент не хранит состояние, 
а только отображает его.

[(ngModel)] в Angular — это «батарейка» для двустороннего связывания, работает 
из коробки, но требует импорта FormsModule. В React то же самое делается вручную 
через value и onChange, что даёт больше контроля, но требует больше кода.

Сервис с DI и useState в React — принципиально разные подходы. Angular 
разделяет «что показывать» (компонент) и «откуда брать данные» (сервис), что 
удобно для больших приложений. В React то же разделение делают через кастомные 
хуки или Redux/Zustand, но это уже не встроено в сам React.

## Управление потоком

- *ngFor — перебор массива (аналог .map() в React)
- *ngIf — условный рендер (аналог {condition && <Component />} в React)
- [class.active]="..." — условное добавление CSS-класса
- [class.completed]="task.completed" — то же для задачи

## Технические особенности

- Angular 19+, standalone-компоненты (без NgModule)
- FormsModule подключён через imports: [CommonModule, FormsModule]
- Сервис инжектится через constructor(public todoService: TodoService)
- Дизайн: аврора-фон с анимированными градиентными пятнами, стеклянная карточка 
  (backdrop-filter: blur), кастомный чекбокс, всплывающие частицы# Task15

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
