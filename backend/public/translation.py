from modeltranslation.translator import register, TranslationOptions
from .models import Topic, DisabilityType, Resource, NewsArticle, Event

@register(Topic)
class TopicTranslationOptions(TranslationOptions):
    fields = ('name', 'description')

@register(DisabilityType)
class DisabilityTypeTranslationOptions(TranslationOptions):
    fields = ('name',)

@register(Resource)
class ResourceTranslationOptions(TranslationOptions):
    fields = ('title', 'description')

@register(NewsArticle)
class NewsArticleTranslationOptions(TranslationOptions):
    fields = ('title', 'excerpt', 'content')

@register(Event)
class EventTranslationOptions(TranslationOptions):
    fields = ('title', 'description')
