# CineVault Frontend

Angular 19 frontend for the CineVault Movie Theater Management System.

## Setup

```bash
cd frontend
npm install
```

## Run

```bash
npm start
```

Navigate to `http://localhost:4200/`

## Features

- **Standalone Components**: All components use Angular 19 standalone architecture
- **Signals**: State management using Angular Signals
- **Control Flow**: New `@for`, `@if`, `@empty` syntax
- **RxJS Interop**: `toSignal()` and `toObservable()` for reactive programming

## Components

- **CineTech**: Movie management (MovieComponent, ListeComponent, ItemComponent, DetailComponent)
- **TicketPriceEngineComponent**: Signal-based ticket calculator with discounts
- **GenreListComponent**: Demonstrates @for/@empty control flow
- **LoginComponent**: Template-driven form with validation
- **WordComponent**: ngStyle/ngClass simulator

## Exercises Reference

- Exercise 5.1: TicketPriceEngineComponent with computed() signals
- Exercise 5.2: GenreListComponent with @for/@empty/@if
- Exercise 8.1: RainbowDirective with HostBinding/HostListener
- Exercise 9.1: DefaultImagePipe for missing posters
- Exercise 9.2: TeamPipe for staff nicknames
- Exercise 10.1: BookingCartService (Embauche)
- Exercise 13.1: AuthInterceptor for JWT tokens
