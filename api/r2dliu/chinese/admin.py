from django.contrib import admin

from .models import Card, Character, Deck, Remediation, Review, Word


@admin.register(Character)
class CharacterAdmin(admin.ModelAdmin):
    list_display = ("hanzi", "pinyin", "frequency_rank", "hsk_level", "stroke_count")
    search_fields = ("hanzi",)


@admin.register(Word)
class WordAdmin(admin.ModelAdmin):
    list_display = ("simplified", "pinyin", "frequency_rank", "hsk_level")
    search_fields = ("simplified", "pinyin")


@admin.register(Deck)
class DeckAdmin(admin.ModelAdmin):
    list_display = ("name", "card_kind")


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ("hanzi", "deck", "state", "due", "interval_days", "lapses")
    list_select_related = ("character", "word", "deck")


admin.site.register(Review)
admin.site.register(Remediation)
