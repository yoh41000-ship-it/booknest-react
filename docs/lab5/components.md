# Дерево компонентов BookNest (React)

## Иерархия

App (владеет: query, sortBy, page, data, uiState, wishlist)
├── Header
│   └── Badge (счётчик wishlist)              ← переиспользование #1
├── FiltersPanel (props: query, sortBy, onQueryChange, onSortChange, onReset)
│   └── Button (сброс)                         ← переиспользование #1
├── Main
│   ├── Spinner (если loading)
│   ├── ErrorBox (если error)
│   │   └── Button (повторить)
│   ├── EmptyState (если пусто)
│   ├── BookList (props: books, wishlist, onToggleWishlist)
│   │   └── BookCard × N
│   │       ├── Badge (рейтинг)
│   │       └── Button (в wishlist)
│   └── Pagination (props: page, totalPages, onPageChange)
│       └── Button × 2
└── Wishlist (props: items, onRemove)
    ├── EmptyState (если пусто)
    └── Button (удалить) × N

## Владелец состояния

| Состояние | Компонент-владелец |
|-----------|-------------------|
| query | App |
| sortBy | App |
| page | App |
| data | App |
| uiState | App |
| wishlist | App |
| wishlistDetails | App |
| Производные: sortedItems | App (useMemo) |
| Производные: wishlistBooks | App (useMemo) |

## Презентационные компоненты (без состояния)

- Badge, Button, Spinner, EmptyState, ErrorBox
- BookCard, BookList, FiltersPanel, Pagination, Wishlist

Итого: 10 презентационных + App = 11 компонентов.