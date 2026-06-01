from modeltranslation.translator import register, TranslationOptions
from .models import ForumCategory

@register(ForumCategory)
class ForumCategoryTranslationOptions(TranslationOptions):
    fields = ('name', 'description')
