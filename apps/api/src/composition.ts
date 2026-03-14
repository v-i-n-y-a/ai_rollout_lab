import {
  InMemoryItemRepository,
  InMemorySummaryRepository,
  InMemoryEventRepository,
  InMemoryFeedbackRepository,
  InMemoryFlagRepository
} from "./adapters/index.js";
import {
  ItemsUseCase,
  SummaryUseCase,
  FeedbackUseCase,
  EventsUseCase,
  FlagsUseCase
} from "./use-cases/index.js";
import {
  createItemsRoutes,
  createSummaryRoutes,
  createFeedbackRoutes,
  createEventsRoutes,
  createFlagsRoutes
} from "./http/routes.js";

export function compose() {
  const itemRepo = new InMemoryItemRepository();
  const summaryRepo = new InMemorySummaryRepository();
  const eventRepo = new InMemoryEventRepository();
  const feedbackRepo = new InMemoryFeedbackRepository();
  const flagRepo = new InMemoryFlagRepository();

  const itemsUseCase = new ItemsUseCase(itemRepo);
  const summaryUseCase = new SummaryUseCase(itemRepo, summaryRepo, flagRepo);
  const feedbackUseCase = new FeedbackUseCase(feedbackRepo);
  const eventsUseCase = new EventsUseCase(eventRepo);
  const flagsUseCase = new FlagsUseCase(flagRepo);

  const itemsRoutes = createItemsRoutes(itemsUseCase);
  const summaryRoutes = createSummaryRoutes(summaryUseCase);
  const feedbackRoutes = createFeedbackRoutes(feedbackUseCase);
  const eventsRoutes = createEventsRoutes(eventsUseCase);
  const flagsRoutes = createFlagsRoutes(flagsUseCase);

  return {
    itemsRoutes,
    summaryRoutes,
    feedbackRoutes,
    eventsRoutes,
    flagsRoutes
  };
}
