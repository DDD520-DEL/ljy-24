import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CircleHelp, ChevronDown, ThermometerSnowflake, Thermometer, Flame, BarChart3, RefreshCw, Vote, Palette, Clock, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ElementType;
  iconColor: string;
}

const FAQ_CATEGORIES: { title: string; items: FAQItem[] }[] = [
  {
    title: '投票规则',
    items: [
      {
        question: '如何进行温度投票？',
        answer: '在首页选择你当前乘坐的地铁线路和车厢编号，然后点击最符合你体感的按钮（冷 / 舒适 / 热）即可完成投票。站点区间为选填项，填写后可以帮助统计不同站点的温度差异。所有数据匿名提交，无需注册登录。',
        icon: Vote,
        iconColor: 'text-metro-lightBlue',
      },
      {
        question: '投票频率有限制吗？',
        answer: '为了保证数据的真实性和有效性，同一用户对同一车厢在短时间内仅能投票一次。你可以切换到其他车厢或线路继续投票。每次投票都会记录当时的时间段（早高峰 / 晚高峰 / 平峰），方便按时段统计分析。',
        icon: Clock,
        iconColor: 'text-purple-400',
      },
      {
        question: '投票数据是匿名的吗？',
        answer: '是的，所有投票数据均为匿名提交。我们不会收集你的个人身份信息，投票记录仅包含线路、车厢、体感等级和时间等必要数据，确保你的隐私安全。',
        icon: ShieldCheck,
        iconColor: 'text-green-400',
      },
    ],
  },
  {
    title: '温度评分',
    items: [
      {
        question: '温度评分是如何计算的？',
        answer: '温度评分采用加权算法：每个车厢的「冷」票数、「舒适」票数和「热」票数会按不同权重计算出一个综合分数（范围 -100 到 +100）。「冷」票拉低分数，「热」票推高分数，「舒适」票使分数趋向 0。分数越低表示越冷，越高表示越热，接近 0 表示体感舒适。',
        icon: BarChart3,
        iconColor: 'text-yellow-400',
      },
      {
        question: '评分中的趋势箭头代表什么？',
        answer: '趋势箭头反映该车厢近期评分的变化方向：↑ 表示温度正在升高（变热），↓ 表示温度正在降低（变冷），→ 表示温度相对稳定。趋势是根据最近一段时间内的投票数据变化计算得出的，帮助你判断车厢温度的走向。',
        icon: RefreshCw,
        iconColor: 'text-cyan-400',
      },
    ],
  },
  {
    title: '颜色含义',
    items: [
      {
        question: '热力图中的颜色分别代表什么？',
        answer: '热力图使用五种颜色对应不同温度区间：蓝色（冻僵，评分 ≤ -60）、浅蓝色（偏冷，-60 < 评分 ≤ -20）、绿色（舒适，-20 < 评分 ≤ 20）、橙色（偏热，20 < 评分 ≤ 60）、红色（闷热，评分 > 60）。颜色越偏蓝表示越冷，越偏红表示越热，绿色代表体感舒适。',
        icon: Palette,
        iconColor: 'text-pink-400',
      },
      {
        question: '投票按钮的颜色代表什么？',
        answer: '三个投票按钮分别用不同颜色表示体感等级：蓝色雪花图标代表「冷」，绿色温度计图标代表「舒适」，红色火焰图标代表「热」。点击对应按钮即可为你所在的车厢投出相应体感的一票。',
        icon: Thermometer,
        iconColor: 'text-green-400',
      },
    ],
  },
  {
    title: '数据与更新',
    items: [
      {
        question: '数据多久更新一次？',
        answer: '投票数据是实时更新的。当你或其他人提交投票后，热力图和统计数据会在下次刷新时自动反映最新结果。页面切换或重新进入时会自动拉取最新数据，你也可以手动刷新页面获取最新信息。',
        icon: RefreshCw,
        iconColor: 'text-cyan-400',
      },
      {
        question: '温度异常提醒是什么？',
        answer: '当系统检测到某车厢的温度评分在短时间内出现剧烈波动（如从舒适突然变为极冷或极热），会自动生成温度异常提醒。异常分为「预警」和「危险」两个等级，提醒你注意或避开该车厢。异常检测基于投票数据的统计分析，置信度越高表示结果越可靠。',
        icon: ThermometerSnowflake,
        iconColor: 'text-blue-400',
      },
    ],
  },
];

function AccordionItem({ item, isOpen, onToggle, index }: { item: FAQItem; isOpen: boolean; onToggle: () => void; index: number }) {
  const Icon = item.icon;

  return (
    <div
      className={cn(
        'bg-metro-card/70 border border-metro-border rounded-2xl backdrop-blur-sm overflow-hidden',
        'hover:border-metro-blue/50 transition-all duration-300',
        'animate-slide-up opacity-0',
        isOpen && 'border-metro-blue/40'
      )}
      style={{ animationDelay: `${index * 60 + 100}ms` }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-metro-blue/50 focus-visible:ring-inset rounded-2xl"
      >
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', 'bg-metro-darker border border-metro-border')}>
          <Icon className={cn('w-5 h-5', item.iconColor)} />
        </div>
        <span className="flex-1 font-medium text-slate-200 text-sm sm:text-base leading-relaxed">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300',
            isOpen && 'rotate-180 text-metro-lightBlue'
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-0">
            <div className="h-px bg-gradient-to-r from-transparent via-metro-border to-transparent mb-4" />
            <div className="pl-14">
              <p className="text-sm text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndices, setOpenIndices] = useState<Set<string>>(new Set());

  const toggleItem = (categoryIdx: number, itemIdx: number) => {
    const key = `${categoryIdx}-${itemIdx}`;
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-metro-blue to-metro-lightBlue flex items-center justify-center shadow-lg shadow-metro-blue/30">
                <CircleHelp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  常见问题
                </h1>
              </div>
            </div>
            <p className="text-slate-400 text-sm ml-[52px]">
              关于地铁温度计的使用疑问，在这里找到答案
            </p>
          </div>

          <div className="space-y-8">
            {FAQ_CATEGORIES.map((category, catIdx) => (
              <div key={catIdx}>
                <h2 className="font-display text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2 animate-fade-in">
                  <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-metro-blue to-metro-lightBlue" />
                  {category.title}
                </h2>
                <div className="space-y-3">
                  {category.items.map((item, itemIdx) => (
                    <AccordionItem
                      key={itemIdx}
                      item={item}
                      isOpen={openIndices.has(`${catIdx}-${itemIdx}`)}
                      onToggle={() => toggleItem(catIdx, itemIdx)}
                      index={catIdx * 10 + itemIdx}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 bg-metro-card/50 border border-metro-border rounded-2xl animate-slide-up delay-400 opacity-0">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-metro-darker border border-metro-border flex items-center justify-center flex-shrink-0">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="font-medium text-slate-200 text-sm mb-1">还有其他问题？</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  如果以上内容没有解答你的疑问，欢迎在投票页面提交反馈，我们会持续完善帮助文档。你的每一个问题都是我们改进的动力！
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
