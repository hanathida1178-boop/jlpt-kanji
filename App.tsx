
import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, BookOpen, XCircle, AlertCircle,
  CheckCircle2, Clock, Plus, LayoutGrid, Upload, X, Loader2, Sparkles,
  Trophy, Book, Star, PenTool
} from 'lucide-react';
import { romajiToHiragana } from './utils';
import { StrokeOrderModal } from './StrokeOrderModal';
import { DEFAULT_DECKS } from './constants';
import { Deck, KanjiCard, UserProgress, ViewState, FeedbackType } from './types';

// Components
const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
    <div
      className="h-full bg-indigo-500 transition-all duration-500 ease-out"
      style={{ width: `${(current / total) * 100}%` }}
    />
  </div>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('home');
  const [decks, setDecks] = useState<Deck[]>(DEFAULT_DECKS);
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({});
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadText, setUploadText] = useState("");
  const [isStrokeOrderOpen, setIsStrokeOrderOpen] = useState(false);

  // Load Data from LocalStorage
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('kanji-saya-progress');
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }

      const savedDecks = localStorage.getItem('kanji-saya-custom-decks');
      if (savedDecks) {
        const customDecks = JSON.parse(savedDecks);
        setDecks([...DEFAULT_DECKS, ...customDecks]);
      }
    } catch (err) {
      console.error("Storage Load Error", err);
    } finally {
      // Small timeout to show the nice loader for a moment
      setTimeout(() => setLoading(false), 800);
    }
  }, []);

  const activeDeck = useMemo(() => decks.find(d => d.id === activeDeckId), [decks, activeDeckId]);
  const dueCards = useMemo(() => {
    if (!activeDeck) return [];
    const now = Date.now();
    return activeDeck.cards.filter(card => (userProgress[card.id] || 0) <= now);
  }, [activeDeck, userProgress]);

  const currentCard = dueCards[currentIndex];

  const handleMark = (type: 'wrong' | 'hard' | 'easy') => {
    if (!currentCard) return;

    const now = Date.now();
    let nextTime;

    switch (type) {
      case 'wrong':
        nextTime = now;
        setFeedback({ msg: "ချက်ချင်းပြန်ပြပါမည်", color: "text-red-500 border-red-100" });
        break;
      case 'hard':
        nextTime = now + (24 * 60 * 60 * 1000);
        setFeedback({ msg: "၁ ရက်ကြာမှ ပြန်ပြပါမည်", color: "text-amber-500 border-amber-100" });
        break;
      case 'easy':
        nextTime = now + (5 * 24 * 60 * 60 * 1000);
        setFeedback({ msg: "၅ ရက်ကြာမှ ပြန်ပြပါမည်", color: "text-emerald-500 border-emerald-100" });
        break;
    }

    const newProgress = { ...userProgress, [currentCard.id]: nextTime };
    setUserProgress(newProgress);

    // Save to LocalStorage
    localStorage.setItem('kanji-saya-progress', JSON.stringify(newProgress));

    // Immediately update UI
    setIsFlipped(false);

    setTimeout(() => {
      setFeedback(null);

      // WRONG: Card stays in deck, move to next position
      // HARD/EASY: Card will be filtered out, so next card shifts into current position
      if (type === 'wrong') {
        setCurrentIndex(prev => {
          const next = (prev + 1) % dueCards.length;
          return next;
        });
      } else {
        // For hard/easy, don't change index - the list will shrink and next card appears at current index
        // But we need to handle the case where we were at the last card
        setCurrentIndex(prev => {
          // If we're going to be out of bounds after card removal, go to start
          if (prev >= dueCards.length - 1) {
            return 0;
          }
          return prev;
        });
      }
    }, 300);
  };

  // Sync index if it goes out of bounds (e.g. after card removal)
  useEffect(() => {
    if (dueCards.length > 0 && currentIndex >= dueCards.length) {
      setCurrentIndex(0);
    }
  }, [dueCards.length, currentIndex]);

  const handleUploadDeck = () => {
    if (!uploadText) return;
    try {
      const newDeck = JSON.parse(uploadText);
      if (!newDeck.id || !newDeck.cards) throw new Error("Invalid format");

      const existingCustomDecks = decks.filter(d => !DEFAULT_DECKS.some(def => def.id === d.id));
      const updatedUserDecks = [...existingCustomDecks.filter(d => d.id !== newDeck.id), newDeck];

      localStorage.setItem('kanji-saya-custom-decks', JSON.stringify(updatedUserDecks));
      setDecks([...DEFAULT_DECKS, ...updatedUserDecks]);
      setIsUploadModalOpen(false);
      setUploadText("");
    } catch (e) {
      alert("Format Error: JSON format (id, title, cards[]) is required.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      <p className="text-slate-400 font-bold animate-pulse">Loading Kanji Data...</p>
    </div>
  );

  if (view === 'home') {
    const now = Date.now();
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-12 flex flex-col items-center">
        <div className="max-w-2xl w-full">
          <header className="flex justify-between items-start mb-6 md:mb-12">
            <div className="flex items-center gap-4">
              <img src="/app-icon.png" alt="Kanji Saya Icon" className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-lg border-2 border-white object-cover" />
              <div>
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">N4 Mastering</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Kanji Saya
                </h1>
              </div>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-white border-2 border-indigo-50 text-indigo-600 p-4 rounded-3xl shadow-lg hover:shadow-indigo-100 hover:border-indigo-400 active:scale-95 transition-all"
            >
              <Plus className="w-6 h-6" />
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {decks.map(deck => {
              const total = deck.cards.length;
              const reviewedIds = deck.cards.filter(c => userProgress[c.id]).map(c => c.id);
              const completed = deck.cards.filter(c => userProgress[c.id] && (userProgress[c.id] - now > 3 * 24 * 60 * 60 * 1000)).length;
              const dueCount = deck.cards.filter(c => (userProgress[c.id] || 0) <= now).length;

              return (
                <div
                  key={deck.id}
                  onClick={() => { setActiveDeckId(deck.id); setView('study'); setCurrentIndex(0); }}
                  className="bg-white rounded-[2rem] p-5 md:p-6 shadow-sm border border-slate-100 cursor-pointer hover:border-indigo-400 hover:shadow-2xl hover:-translate-y-1 transition-all group active:scale-[0.98]"
                >
                  <div className="flex justify-between items-start mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      <LayoutGrid className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    {dueCount > 0 ? (
                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {dueCount} DUE
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black">MASTERED</span>
                    )}
                  </div>

                  <h3 className="font-black text-xl text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">{deck.title}</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      <span>Progress</span>
                      <span>{completed} / {total}</span>
                    </div>
                    <ProgressBar current={completed} total={total} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl animate-in zoom-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2"><Upload className="w-5 h-5" /> Import Deck</h2>
                <button onClick={() => setIsUploadModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
              </div>
              {/* FIXED: Wrapped the literal curly braces in a string literal to prevent them from being parsed as a JSX expression. */}
              <p className="text-[11px] text-slate-400 mb-4 font-bold uppercase tracking-widest leading-relaxed">JSON format အတိုင်း ထည့်သွင်းပါ။ (id, title, cards: {'{ kanji, meaning, examples }'}[] )</p>
              <textarea
                className="w-full h-48 bg-slate-50 border border-slate-200 rounded-3xl p-5 text-[11px] font-mono outline-none focus:border-indigo-400 transition-all mb-6 focus:ring-4 focus:ring-indigo-100"
                placeholder='{ "id": "my-deck", "title": "My Kanji", "cards": [...] }'
                value={uploadText}
                onChange={(e) => setUploadText(e.target.value)}
              />
              <button
                onClick={handleUploadDeck}
                className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                Upload & Sync
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // STUDY VIEW
  return (
    <div className="h-screen bg-slate-50 flex flex-col items-center p-3 md:p-8 overflow-hidden">
      <div className="max-w-xl w-full flex flex-col h-full">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-0 md:mb-8">
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 text-slate-400 font-black text-[10px] tracking-widest hover:text-indigo-600 transition-all uppercase"
          >
            <ChevronLeft className="w-5 h-5" /> Back Home
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white px-5 py-2 rounded-full text-[10px] font-black shadow-lg shadow-indigo-100 uppercase tracking-widest italic flex items-center gap-2">
              <Clock className="w-3 h-3" /> လေ့လာရန်: {dueCards.length}
            </div>
          </div>
        </div>

        {/* Feedback Area */}
        <div className="h-4 md:h-12 mb-0 md:mb-4 flex justify-center">
          <div className={`transition-all duration-300 ${feedback ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}`}>
            {feedback && (
              <div className={`${feedback.color} bg-white shadow-xl border-2 px-6 py-2 rounded-full flex items-center gap-2 text-[10px] md:text-[11px] font-black italic`}>
                {feedback.msg}
              </div>
            )}
          </div>
        </div>

        {dueCards.length > 0 ? (
          <>
            {/* Flashcard Container */}
            <div className="relative flex-grow md:h-[560px] w-full perspective-1000 mb-4 md:mb-10">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative w-full h-full transition-all duration-700 transform-style-3d cursor-pointer rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl ${isFlipped ? 'rotate-y-180' : ''}`}
              >
                {/* FRONT FACE */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col items-center justify-center p-6 md:p-8 border-[8px] md:border-[12px] border-slate-100 shadow-inner group">
                  {/* Card number in top right */}
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-300 text-xs md:text-sm font-bold">
                    {currentIndex + 1}/{dueCards.length}
                  </div>

                  <div className="text-[110px] md:text-[180px] leading-none font-bold text-indigo-950 tracking-tighter drop-shadow-sm group-hover:scale-110 transition-transform duration-500">
                    {currentCard.kanji}
                  </div>
                  <div className="mt-8 md:mt-16 flex flex-col items-center gap-3">
                    <div className="px-4 py-1.5 bg-indigo-50 text-indigo-500 text-[10px] font-black uppercase tracking-widest rounded-full">Touch to reveal</div>
                  </div>
                </div>

                {/* BACK FACE */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-[2.5rem] md:rounded-[3.5rem] rotate-y-180 flex flex-col p-6 md:p-14 border-[8px] md:border-[12px] border-indigo-50 overflow-y-auto overflow-x-hidden">
                  <div className="flex justify-between items-start mb-3 md:mb-8 border-b-2 border-slate-100 pb-3 md:pb-6">
                    <div className="flex flex-col">
                      <span className="text-5xl md:text-7xl font-bold text-indigo-900 leading-none">{currentCard.kanji}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsStrokeOrderOpen(true); }}
                        className="mt-3 flex items-center gap-2.5 text-[13px] font-black text-white uppercase tracking-widest hover:bg-indigo-700 transition-all bg-indigo-600 px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-100 active:scale-95 border-none"
                      >
                        <PenTool className="w-4 h-4 text-indigo-100" /> ရေးနည်း
                      </button>
                    </div>
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full shadow-sm self-start">{activeDeck?.title}</span>
                  </div>

                  <div className="space-y-4 md:space-y-10">
                    <section>
                      <label className="text-[10px] md:text-[12px] font-black text-indigo-400 uppercase tracking-[0.2em] block mb-1 md:mb-3">မြန်မာအဓိပ္ပာယ်</label>
                      <p className="text-2xl md:text-3xl text-slate-800 font-bold leading-tight italic decoration-indigo-200 decoration-2">{currentCard.meaning}</p>
                    </section>

                    <div className="grid grid-cols-2 gap-3 md:gap-8">
                      <section>
                        <label className="text-[10px] md:text-[12px] font-black text-slate-400 uppercase tracking-widest block mb-1 md:mb-3">Onyomi</label>
                        <p className="text-indigo-600 font-bold text-sm md:text-base bg-indigo-50 px-3 md:px-5 py-1.5 md:py-3 rounded-xl md:rounded-2xl inline-block shadow-sm border border-indigo-100">{currentCard.onyomi}</p>
                      </section>
                      <section>
                        <label className="text-[10px] md:text-[12px] font-black text-slate-400 uppercase tracking-widest block mb-1 md:mb-3">Kunyomi</label>
                        <p className="text-emerald-600 font-bold text-sm md:text-base bg-emerald-50 px-3 md:px-5 py-1.5 md:py-3 rounded-xl md:rounded-2xl inline-block shadow-sm border border-emerald-100">{currentCard.kunyomi || "-"}</p>
                      </section>
                    </div>

                    <section>
                      <label className="text-[10px] md:text-[12px] font-black text-slate-400 uppercase tracking-widest block mb-2 md:mb-5">ဥပမာ စာလုံးများ</label>
                      <div className="space-y-1.5 md:space-y-4">
                        {currentCard.examples.map((ex, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-50 p-3 md:p-6 rounded-[1.2rem] md:rounded-[2rem] border border-slate-200 hover:bg-white hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group/ex">
                            <div>
                              <span className="font-bold text-indigo-950 text-lg md:text-xl block mb-0.5">{ex.word}</span>
                              <span className="text-slate-400 italic text-xs md:text-sm font-bold group-hover/ex:text-indigo-500">[{romajiToHiragana(ex.reading)}]</span>
                            </div>
                            <div className="text-slate-600 font-bold italic text-sm md:text-sm text-right max-w-[120px] md:max-w-[140px] leading-snug">{ex.mean}</div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Controls Group */}
            <div className="flex flex-col gap-4 pb-4">
              {/* Controls Area */}
              <div className="h-24 md:h-32">
                {isFlipped ? (
                  <div className="grid grid-cols-3 gap-3 md:gap-5 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMark('wrong'); }}
                      className="flex flex-col items-center justify-center py-4 md:py-6 bg-white hover:bg-red-500 hover:text-white border-2 border-red-50 text-red-500 rounded-[1.5rem] md:rounded-[2.5rem] transition-all shadow-xl shadow-red-50 active:scale-90 group"
                    >
                      <XCircle className="w-8 h-8 md:w-10 md:h-10 mb-1 md:mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] md:text-[13px] font-black uppercase italic tracking-widest">မရသေး</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMark('hard'); }}
                      className="flex flex-col items-center justify-center py-4 md:py-6 bg-white hover:bg-amber-500 hover:text-white border-2 border-amber-50 text-amber-500 rounded-[1.5rem] md:rounded-[2.5rem] transition-all shadow-xl shadow-amber-50 active:scale-90 group"
                    >
                      <AlertCircle className="w-8 h-8 md:w-10 md:h-10 mb-1 md:mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] md:text-[13px] font-black uppercase italic tracking-widest">သိရုံပဲ</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMark('easy'); }}
                      className="flex flex-col items-center justify-center py-4 md:py-6 bg-white hover:bg-emerald-500 hover:text-white border-2 border-emerald-50 text-emerald-500 rounded-[1.5rem] md:rounded-[2.5rem] transition-all shadow-xl shadow-emerald-50 active:scale-90 group"
                    >
                      <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 mb-1 md:mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] md:text-[13px] font-black uppercase italic tracking-widest">ကျွမ်းကျင်</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-white/20 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-dashed border-white/40 backdrop-blur-sm transition-all" />
                )}
              </div>

              {/* Bottom Bar Controls */}
              <div className="flex items-center justify-between px-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev - 1 + dueCards.length) % dueCards.length); }}
                  disabled={dueCards.length <= 1}
                  className="p-4 md:p-6 bg-white rounded-full shadow-xl text-slate-300 active:bg-indigo-50 active:scale-90 transition-all border-2 border-slate-50 disabled:opacity-30"
                >
                  <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>

                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-1.5">
                    {[...Array(Math.min(5, dueCards.length))].map((_, i) => (
                      <div key={i} className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full transition-all duration-300 ${i === currentIndex % 5 ? 'bg-indigo-600 w-3 md:w-4' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black text-slate-300 tracking-[0.2em] md:tracking-[0.3em] uppercase italic mt-1 md:mt-2">
                    Card {dueCards.length > 0 ? currentIndex + 1 : 0} of {dueCards.length}
                  </span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev + 1) % dueCards.length); }}
                  disabled={dueCards.length <= 1}
                  className="p-4 md:p-6 bg-indigo-600 rounded-full shadow-2xl text-white active:scale-90 transition-all shadow-indigo-300 hover:bg-indigo-700 disabled:bg-slate-300"
                >
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Finished State */
          <div className="flex-grow bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl flex flex-col items-center justify-center p-8 md:p-12 text-center border-[8px] md:border-[12px] border-indigo-50 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-pulse"></div>
            <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-50 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mb-6 md:mb-10 shadow-inner rotate-12 transition-transform hover:rotate-0 duration-500">
              <Trophy className="w-12 h-12 md:w-16 md:h-16 text-indigo-500" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-950 mb-2 md:mb-4 tracking-tighter">Deck Completed!</h2>
            <p className="text-slate-400 mb-8 md:mb-12 text-xs md:text-sm font-bold max-w-[260px] leading-relaxed italic">
              လေ့လာစရာတွေ အကုန်ပြီးသွားပါပြီ။ မနက်ဖြန်မှ ပြန်လာခဲ့ပေးပါ။
            </p>
            <button
              onClick={() => setView('home')}
              className="px-10 py-4 md:px-14 md:py-6 bg-indigo-600 text-white rounded-[1.5rem] md:rounded-[2.2rem] font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px] md:text-[11px] italic"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
      <StrokeOrderModal
        kanji={currentCard?.kanji || ""}
        isOpen={isStrokeOrderOpen}
        onClose={() => setIsStrokeOrderOpen(false)}
      />
    </div>
  );
}
