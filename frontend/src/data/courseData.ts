// TradeMaster Course Content Data
// Structure: Levels > Modules > Lessons

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  objective: string;
  content: string;
  keyTakeaways: string[];
  faqs: { question: string; answer: string }[];
  quiz: Question[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  finalQuiz: Question[];
}

export interface Level {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  finalAssessment: Question[];
}

export const courseData: Level[] = [
  {
    id: "beginner",
    title: "Beginner",
    description: "Master the fundamentals of derivatives trading",
    modules: [
      {
        id: "derivatives-basics",
        title: "Derivatives Basics & Market Participants",
        description: "Understand what derivatives are and who trades them",
        icon: "📊",
        lessons: [
          {
            id: "what-are-derivatives",
            title: "What Are Derivatives?",
            objective: "Understand the fundamental concept of derivative instruments and why they exist in financial markets.",
            content: `A derivative is a financial contract whose value is derived from an underlying asset. Think of it like a shadow—its movements are connected to something else, whether that's a stock, commodity, currency, or index.

The underlying asset could be almost anything with a measurable value: shares of Reliance Industries, the price of crude oil, the USD/INR exchange rate, or the Nifty 50 index.

**Why Do Derivatives Exist?**

Derivatives emerged from a practical need: farmers wanted to lock in prices for their crops before harvest, and buyers wanted price certainty for their purchases. This concept of "forward contracting" evolved into the sophisticated derivatives markets we see today.

In modern markets, derivatives serve three primary purposes:

**1. Hedging** - Protecting against adverse price movements. A jeweler might use gold futures to lock in prices for their inventory.

**2. Speculation** - Taking calculated bets on price direction. Traders who believe Nifty will rise might buy call options instead of the underlying stocks.

**3. Arbitrage** - Exploiting price differences across markets. If the same asset trades at different prices in different venues, traders can profit from the discrepancy.

The derivatives market in India has grown exponentially. NSE's derivatives segment now handles daily volumes exceeding ₹100 lakh crores, making it one of the largest derivatives markets globally.`,
            keyTakeaways: [
              "Derivatives derive their value from an underlying asset",
              "Common underlyings include stocks, indices, commodities, and currencies",
              "Three main uses: hedging, speculation, and arbitrage",
              "Indian derivatives market is among the world's largest by volume"
            ],
            faqs: [
              {
                question: "Do I need to own the underlying asset to trade derivatives?",
                answer: "No, you don't need to own the underlying asset. Derivatives are contracts that can be bought and sold independently. However, understanding the underlying asset is crucial for making informed trading decisions."
              },
              {
                question: "Are derivatives only for professional traders?",
                answer: "While derivatives were once the domain of institutions, retail participation has grown significantly. However, they require proper education and risk management due to their leveraged nature."
              },
              {
                question: "What's the minimum capital needed to start trading derivatives in India?",
                answer: "This varies by contract. A Nifty options contract requires a premium (which varies) plus margins. Starting with smaller positions and paper trading is recommended for beginners."
              }
            ],
            quiz: [
              {
                id: "q1",
                question: "What does 'derivative' mean in the context of financial markets?",
                options: [
                  "A type of bank account",
                  "A financial contract whose value comes from an underlying asset",
                  "A method of calculating interest",
                  "A government bond"
                ],
                correctIndex: 1,
                explanation: "Derivatives are financial instruments that derive their value from an underlying asset like stocks, indices, or commodities."
              },
              {
                id: "q2",
                question: "Which of the following is NOT a primary use of derivatives?",
                options: [
                  "Hedging against price risk",
                  "Speculating on price movements",
                  "Printing money",
                  "Arbitrage opportunities"
                ],
                correctIndex: 2,
                explanation: "The three main uses of derivatives are hedging, speculation, and arbitrage. Printing money is not a function of derivatives."
              },
              {
                id: "q3",
                question: "A jeweler wants to protect against rising gold prices. Which derivative purpose does this represent?",
                options: [
                  "Speculation",
                  "Arbitrage",
                  "Hedging",
                  "Day trading"
                ],
                correctIndex: 2,
                explanation: "Hedging involves using derivatives to protect against adverse price movements. The jeweler is hedging against the risk of gold prices increasing."
              }
            ]
          },
          {
            id: "market-participants",
            title: "Market Participants",
            objective: "Identify the different types of traders in the derivatives market and understand their motivations.",
            content: `The derivatives market is an ecosystem with diverse participants, each playing a crucial role. Understanding who you're trading against helps you anticipate market behavior and refine your strategies.

**1. Hedgers - The Risk Managers**

Hedgers use derivatives to protect existing positions. They're not trying to profit from the derivative itself—they're insuring against adverse moves.

*Example:* An IT company expects to receive $10 million in three months. Worried about rupee appreciation, they buy USD/INR put options. If the dollar weakens, their options profit offsets the export revenue loss.

**2. Speculators - The Risk Takers**

Speculators take on risk that hedgers want to shed. They have no underlying exposure—they're trading purely on their market views.

*Example:* A trader believes Nifty will rally before expiry. Rather than buying all 50 stocks, they buy Nifty call options, gaining leveraged exposure to the index move.

**3. Arbitrageurs - The Efficiency Police**

Arbitrageurs hunt for price discrepancies. Their activity keeps markets efficient by eliminating mispricings.

*Example:* If Nifty futures trade at a discount to fair value, arbitrageurs buy futures while selling the cash index, locking in a risk-free profit.

**4. Market Makers - The Liquidity Providers**

Market makers quote both buy and sell prices, earning the spread between them. They provide liquidity that enables other participants to trade easily.

*Example:* A market maker might quote Bank Nifty options at ₹195-197. They profit from the ₹2 spread while managing their directional risk through hedging.

**The Food Chain**

Understanding this hierarchy is crucial. Hedgers are the "natural" players with real business needs. Speculators provide liquidity and take the other side of hedger trades. Arbitrageurs keep prices aligned. Market makers oil the entire machine.`,
            keyTakeaways: [
              "Hedgers use derivatives to manage existing business risks",
              "Speculators take on risk for potential profit without underlying exposure",
              "Arbitrageurs maintain market efficiency by exploiting mispricings",
              "Market makers provide liquidity by continuously quoting prices"
            ],
            faqs: [
              {
                question: "Which category do retail traders fall into?",
                answer: "Most retail traders are speculators, trading based on market views rather than hedging business exposure. Some sophisticated retail traders may engage in arbitrage strategies."
              },
              {
                question: "Can one trader be multiple participant types?",
                answer: "Absolutely. A large institution might hedge their portfolio while also running a speculative trading desk and capturing arbitrage opportunities."
              },
              {
                question: "Why do markets need speculators?",
                answer: "Speculators provide essential liquidity. Without them, hedgers would struggle to find counterparties, and spreads would widen significantly."
              }
            ],
            quiz: [
              {
                id: "q1",
                question: "An exporter uses currency derivatives to protect against rupee appreciation. This trader is a:",
                options: [
                  "Speculator",
                  "Hedger",
                  "Arbitrageur",
                  "Market maker"
                ],
                correctIndex: 1,
                explanation: "The exporter has real business exposure to currency risk and is using derivatives to protect against it—classic hedging behavior."
              },
              {
                id: "q2",
                question: "A trader notices Nifty futures are cheaper than the cash index and trades to capture this difference. This is:",
                options: [
                  "Hedging",
                  "Speculation",
                  "Arbitrage",
                  "Market making"
                ],
                correctIndex: 2,
                explanation: "Exploiting price differences between related instruments for risk-free profit is the definition of arbitrage."
              },
              {
                id: "q3",
                question: "Market makers earn profits primarily through:",
                options: [
                  "Predicting market direction",
                  "The bid-ask spread",
                  "Dividend income",
                  "Government subsidies"
                ],
                correctIndex: 1,
                explanation: "Market makers profit from the difference between their buy price (bid) and sell price (ask), earning the spread on each transaction."
              }
            ]
          }
        ],
        finalQuiz: [
          {
            id: "mq1",
            question: "Derivatives derive their value from:",
            options: [
              "The government",
              "An underlying asset",
              "The stock exchange",
              "Bank interest rates"
            ],
            correctIndex: 1,
            explanation: "The defining characteristic of derivatives is that their value is derived from an underlying asset."
          },
          {
            id: "mq2",
            question: "Which market participant provides liquidity by quoting continuous prices?",
            options: [
              "Hedger",
              "Speculator",
              "Arbitrageur",
              "Market maker"
            ],
            correctIndex: 3,
            explanation: "Market makers continuously quote buy and sell prices, providing liquidity for other participants."
          },
          {
            id: "mq3",
            question: "A farmer selling wheat futures before harvest is engaging in:",
            options: [
              "Speculation",
              "Hedging",
              "Arbitrage",
              "Market making"
            ],
            correctIndex: 1,
            explanation: "The farmer has natural exposure to wheat prices and is using futures to lock in a price—this is hedging."
          },
          {
            id: "mq4",
            question: "The Indian derivatives market primarily trades on:",
            options: [
              "BSE only",
              "NSE only",
              "Both BSE and NSE",
              "MCX only"
            ],
            correctIndex: 2,
            explanation: "Both NSE and BSE offer derivatives trading, though NSE dominates in terms of volume."
          },
          {
            id: "mq5",
            question: "Speculators are important to markets because they:",
            options: [
              "Set interest rates",
              "Provide liquidity and take risk",
              "Regulate the exchanges",
              "Print derivative contracts"
            ],
            correctIndex: 1,
            explanation: "Speculators provide essential liquidity by taking the opposite side of hedger trades."
          }
        ]
      },
      {
        id: "futures-vs-options",
        title: "Futures vs. Options Core Differences",
        description: "Learn the key distinctions between futures and options contracts",
        icon: "⚖️",
        lessons: [
          {
            id: "futures-explained",
            title: "Understanding Futures Contracts",
            objective: "Master the mechanics of futures contracts including obligations, margin, and settlement.",
            content: `A futures contract is an agreement to buy or sell an asset at a predetermined price on a specific future date. Unlike options, futures carry an obligation—not a choice—to fulfill the contract terms.

**The Core Concept**

When you buy a futures contract, you're agreeing to purchase the underlying asset at the agreed price on expiry. When you sell a futures contract, you're agreeing to deliver (or settle the cash equivalent).

*Example:* Nifty is at 22,000. You buy one lot of Nifty Futures at 22,050 (the premium reflects cost of carry). On expiry, if Nifty is at 22,500, you profit ₹450 per unit. If Nifty is at 21,500, you lose ₹550 per unit.

**The Margin System**

Futures require margin—a good-faith deposit. You don't pay the full contract value upfront.

- **Initial Margin**: The upfront deposit (typically 12-20% of contract value)
- **Mark-to-Market (MTM)**: Daily settlement of profits/losses
- **Maintenance Margin**: Minimum balance required; falling below triggers a margin call

*Example:* A Nifty lot (50 units) at 22,000 = ₹11,00,000 notional. With 15% margin, you need ₹1,65,000 to trade it.

**Key Characteristics of Futures**

1. **Obligation on both sides** - Buyer must buy, seller must sell
2. **Standardized contracts** - Fixed lot sizes, expiry dates
3. **Daily settlement** - MTM adjusts your account daily
4. **Leverage** - Control large positions with small capital
5. **No premium** - Unlike options, you don't pay a premium

**Futures Pricing**

Futures typically trade at a premium to spot price due to "cost of carry":

Futures Price = Spot Price + Cost of Carry - Expected Dividends

As expiry approaches, futures and spot prices converge—this is called convergence.`,
            keyTakeaways: [
              "Futures are obligations, not rights—both parties must fulfill the contract",
              "Margin system provides leverage but requires careful monitoring",
              "Daily MTM means profits/losses are settled each day",
              "Futures prices converge to spot prices as expiry approaches"
            ],
            faqs: [
              {
                question: "What happens if I can't meet a margin call?",
                answer: "If you don't add funds, your broker will forcibly close your position (square off) to limit losses. This can happen at an unfavorable price."
              },
              {
                question: "Do I have to hold futures until expiry?",
                answer: "No, you can close your position anytime by taking an opposite trade. Most traders don't hold until expiry."
              },
              {
                question: "Why do futures sometimes trade at a discount?",
                answer: "This 'backwardation' can occur when there's expected dividend payouts, supply constraints, or strong selling pressure."
              }
            ],
            quiz: [
              {
                id: "q1",
                question: "A futures contract represents:",
                options: [
                  "A right but not obligation to buy",
                  "An obligation to buy or sell",
                  "A loan agreement",
                  "A share certificate"
                ],
                correctIndex: 1,
                explanation: "Futures are binding contracts—both buyer and seller are obligated to fulfill the terms."
              },
              {
                id: "q2",
                question: "Mark-to-Market (MTM) in futures trading refers to:",
                options: [
                  "The marketing of futures products",
                  "Daily settlement of profits and losses",
                  "The initial margin requirement",
                  "The closing price calculation"
                ],
                correctIndex: 1,
                explanation: "MTM is the daily settlement process where gains and losses are credited/debited to your account."
              },
              {
                id: "q3",
                question: "Why do futures typically trade at a premium to spot prices?",
                options: [
                  "Because of taxes",
                  "Cost of carry (interest, storage)",
                  "Exchange fees",
                  "Brokerage charges"
                ],
                correctIndex: 1,
                explanation: "Futures prices include the cost of carry—the cost of financing and holding the position until expiry."
              }
            ]
          },
          {
            id: "options-explained",
            title: "Understanding Options Contracts",
            objective: "Grasp the fundamentals of options—rights, premiums, and the asymmetric payoff structure.",
            content: `Options give you the right, but not the obligation, to buy or sell an asset at a specified price by a certain date. This asymmetry is what makes options unique and powerful.

**Two Types of Options**

**Call Option**: The right to BUY the underlying at the strike price
- You profit when the underlying goes UP
- Example: Buy Nifty 22000 CE (Call) → profit if Nifty rises above 22000

**Put Option**: The right to SELL the underlying at the strike price
- You profit when the underlying goes DOWN
- Example: Buy Nifty 22000 PE (Put) → profit if Nifty falls below 22000

**The Premium**

Unlike futures, options require an upfront premium payment. This is the price of the option contract.

*Example:* Nifty 22000 CE trades at ₹200. To buy one lot (50 units), you pay: ₹200 × 50 = ₹10,000.

This ₹10,000 is your maximum loss. Your potential profit is unlimited (for calls) as Nifty can keep rising.

**Buyers vs. Sellers**

| | Option Buyer | Option Seller |
|---|---|---|
| Pays | Premium | Receives premium |
| Right/Obligation | Right only | Obligation |
| Max Loss | Premium paid | Unlimited |
| Max Profit | Unlimited | Premium received |

**Key Terminology**

- **Strike Price**: The price at which you can exercise your right
- **Expiry Date**: When the option contract ends
- **ITM (In-The-Money)**: Option has intrinsic value
- **ATM (At-The-Money)**: Strike ≈ Current price
- **OTM (Out-of-The-Money)**: Option has no intrinsic value

**Why Trade Options?**

1. **Limited risk** (for buyers) - You can't lose more than the premium
2. **Leverage** - Small investment controls large position
3. **Flexibility** - Multiple strategies for different views
4. **Income generation** - Sellers collect premium as income`,
            keyTakeaways: [
              "Options provide rights, not obligations—buyers choose whether to exercise",
              "Call options profit when prices rise; put options profit when prices fall",
              "Premium paid is the maximum loss for option buyers",
              "Option sellers have unlimited risk but collect premium upfront"
            ],
            faqs: [
              {
                question: "Should beginners buy or sell options?",
                answer: "Beginners should start with buying options (limited risk). Selling options has unlimited risk potential and requires more capital and experience."
              },
              {
                question: "What happens to my premium if the option expires worthless?",
                answer: "You lose the entire premium paid. This is why position sizing and strategy selection are crucial."
              },
              {
                question: "Can I trade options on any stock?",
                answer: "Only stocks that meet exchange criteria (liquidity, market cap) have options trading. In India, about 180+ stocks have F&O trading."
              }
            ],
            quiz: [
              {
                id: "q1",
                question: "A call option gives the buyer the right to:",
                options: [
                  "Sell the underlying asset",
                  "Buy the underlying asset",
                  "Hold the underlying indefinitely",
                  "Receive dividends"
                ],
                correctIndex: 1,
                explanation: "Call options give the buyer the right (not obligation) to buy the underlying at the strike price."
              },
              {
                id: "q2",
                question: "The maximum loss for an option buyer is:",
                options: [
                  "Unlimited",
                  "The strike price",
                  "The premium paid",
                  "Zero"
                ],
                correctIndex: 2,
                explanation: "Option buyers can only lose the premium they paid—this is the fundamental advantage of buying options."
              },
              {
                id: "q3",
                question: "If you expect a stock to fall, you would buy a:",
                options: [
                  "Call option",
                  "Put option",
                  "Future",
                  "Bond"
                ],
                correctIndex: 1,
                explanation: "Put options give you the right to sell at the strike price, so they profit when prices fall."
              }
            ]
          }
        ],
        finalQuiz: [
          {
            id: "mq1",
            question: "The key difference between futures and options is:",
            options: [
              "Futures trade on exchanges, options don't",
              "Futures are obligations, options are rights",
              "Options are more liquid",
              "Futures don't require margin"
            ],
            correctIndex: 1,
            explanation: "The fundamental difference: futures obligate both parties, while options give the buyer a right (seller has obligation)."
          },
          {
            id: "mq2",
            question: "Which statement about premiums is correct?",
            options: [
              "Both futures and options require premiums",
              "Only futures require premiums",
              "Only options require premiums",
              "Neither requires premiums"
            ],
            correctIndex: 2,
            explanation: "Only options have premiums. Futures require margin but not a premium payment."
          },
          {
            id: "mq3",
            question: "An ATM (At-The-Money) option is one where:",
            options: [
              "It was purchased from an ATM machine",
              "Strike price equals current market price",
              "The option has expired",
              "Premium is zero"
            ],
            correctIndex: 1,
            explanation: "ATM means the strike price is approximately equal to the current market price of the underlying."
          },
          {
            id: "mq4",
            question: "Daily MTM settlement applies to:",
            options: [
              "Options only",
              "Futures only",
              "Both futures and options",
              "Neither"
            ],
            correctIndex: 1,
            explanation: "MTM (Mark-to-Market) settlement is a feature of futures. Options don't have daily MTM—your premium is paid upfront."
          },
          {
            id: "mq5",
            question: "Who has unlimited risk exposure?",
            options: [
              "Option buyer",
              "Option seller",
              "Both equally",
              "Neither"
            ],
            correctIndex: 1,
            explanation: "Option sellers face theoretically unlimited risk because the underlying can move significantly against them."
          }
        ]
      },
      {
        id: "pricing-settlement",
        title: "Pricing, Settlement, and Bid-Ask Spreads",
        description: "Understand how derivatives are priced and traded",
        icon: "💰",
        lessons: [
          {
            id: "pricing-basics",
            title: "Derivative Pricing Fundamentals",
            objective: "Learn how futures and options prices are determined in the market.",
            content: `Understanding pricing is crucial for making profitable trades. Let's demystify how derivatives get their prices.

**Futures Pricing - Cost of Carry Model**

Futures prices aren't arbitrary—they're mathematically linked to the spot price:

**Futures Price = Spot Price × (1 + r - d)^t**

Where:
- r = risk-free interest rate
- d = dividend yield
- t = time to expiry

*Example:* Reliance at ₹2,800, risk-free rate 7%, 30 days to expiry, no dividends:
Futures ≈ ₹2,800 × (1 + 0.07 × 30/365) ≈ ₹2,816

**Options Pricing - More Complex**

Option premiums consist of two components:

**1. Intrinsic Value** - The immediate exercise value
- Call: Max(Spot - Strike, 0)
- Put: Max(Strike - Spot, 0)

**2. Time Value** - The premium for potential future moves
- Higher when: more time remains, more volatility expected
- Decays as expiry approaches (theta decay)

*Example:* Nifty at 22,100. The 22,000 CE (call) trades at ₹250.
- Intrinsic Value = 22,100 - 22,000 = ₹100
- Time Value = ₹250 - ₹100 = ₹150

**The Greeks**

Options traders use "Greeks" to measure sensitivities:

- **Delta**: Price change per ₹1 move in underlying
- **Theta**: Daily time decay
- **Vega**: Sensitivity to volatility changes
- **Gamma**: Rate of change of delta

**Why This Matters**

Understanding pricing helps you:
1. Identify overpriced or underpriced options
2. Choose the right strike and expiry
3. Manage position risk effectively
4. Avoid buying decaying options near expiry`,
            keyTakeaways: [
              "Futures prices are linked to spot prices via cost of carry",
              "Option premiums = Intrinsic Value + Time Value",
              "Time value decays as expiry approaches (theta)",
              "Greeks measure various sensitivities of options"
            ],
            faqs: [
              {
                question: "Why is volatility important for options pricing?",
                answer: "Higher volatility means higher probability of large moves, making options more valuable. This is captured by 'Vega'—options prices increase when volatility rises."
              },
              {
                question: "What is theta decay and why should I care?",
                answer: "Theta measures how much an option loses value each day. As an option buyer, you're fighting theta—your option loses value daily even if the underlying doesn't move."
              },
              {
                question: "Can intrinsic value be negative?",
                answer: "No, intrinsic value is either positive (ITM) or zero (ATM/OTM). You would never exercise an option for a loss when you can just let it expire."
              }
            ],
            quiz: [
              {
                id: "q1",
                question: "The time value of an option:",
                options: [
                  "Increases as expiry approaches",
                  "Decreases as expiry approaches",
                  "Remains constant",
                  "Is always zero"
                ],
                correctIndex: 1,
                explanation: "Time value decays (theta decay) as expiry approaches—all else equal, options lose value over time."
              },
              {
                id: "q2",
                question: "If a stock is at ₹500 and the 480 Call is trading at ₹35, the intrinsic value is:",
                options: [
                  "₹35",
                  "₹20",
                  "₹0",
                  "₹15"
                ],
                correctIndex: 1,
                explanation: "Intrinsic value of a call = Spot - Strike = ₹500 - ₹480 = ₹20. The remaining ₹15 is time value."
              },
              {
                id: "q3",
                question: "Delta measures:",
                options: [
                  "Time decay",
                  "Volatility sensitivity",
                  "Price change per ₹1 move in underlying",
                  "Trading volume"
                ],
                correctIndex: 2,
                explanation: "Delta tells you how much the option price changes for every ₹1 move in the underlying asset."
              }
            ]
          },
          {
            id: "bid-ask-spreads",
            title: "Bid-Ask Spreads and Liquidity",
            objective: "Understand how bid-ask spreads impact your trading costs and how to navigate them.",
            content: `Every time you trade, you encounter the bid-ask spread. Understanding it can save you significant money over time.

**What is the Bid-Ask Spread?**

- **Bid**: The highest price buyers are willing to pay
- **Ask (Offer)**: The lowest price sellers are willing to accept
- **Spread**: The difference between ask and bid

*Example:* Bank Nifty 48000 CE shows Bid: ₹195, Ask: ₹197
- If you buy, you pay ₹197 (the ask)
- If you sell, you receive ₹195 (the bid)
- Spread = ₹2 (your immediate cost)

**Impact on Trading**

The spread is a hidden cost. To break even on a round trip:

*Example:* You buy at ₹197, sell at ₹195 → Immediate loss of ₹2 per unit.
For one lot (25 units): ₹2 × 25 = ₹50 lost to spread.

**Factors Affecting Spread Width**

1. **Liquidity** - High volume = tight spreads
2. **Volatility** - High volatility = wider spreads
3. **Strike selection** - ATM options have tighter spreads than deep OTM
4. **Time** - Opening and closing hours often have wider spreads
5. **Contract popularity** - Index options > Stock options typically

**Best Practices**

1. **Trade liquid contracts** - Nifty, Bank Nifty have tight spreads
2. **Avoid far OTM options** - Wide spreads eat into profits
3. **Use limit orders** - Don't pay the full spread
4. **Check spread before trading** - Wide spread = hidden cost
5. **Avoid illiquid times** - First/last 15 minutes can have wider spreads

**Limit Orders vs. Market Orders**

- **Market Order**: Buy/sell immediately at best available price
- **Limit Order**: Specify your price; order fills only if market reaches it

*Tip:* Place limit orders between bid and ask to potentially improve execution.`,
            keyTakeaways: [
              "Bid-ask spread is a real cost you pay on every trade",
              "Liquid contracts (Nifty, Bank Nifty) have tighter spreads",
              "Use limit orders to minimize spread impact",
              "Wide spreads on illiquid options can eliminate profits"
            ],
            faqs: [
              {
                question: "How do I know if a spread is too wide?",
                answer: "As a rule of thumb, if the spread exceeds 1-2% of the option price, it's quite wide. For ATM index options, spreads of ₹1-2 are normal."
              },
              {
                question: "Why do market makers widen spreads in volatile markets?",
                answer: "Higher volatility means higher risk for market makers. They widen spreads to compensate for the increased risk of holding positions."
              },
              {
                question: "Should I always use limit orders?",
                answer: "Mostly yes, but in fast-moving markets, limit orders may not get filled. For urgent trades, a market order ensures execution."
              }
            ],
            quiz: [
              {
                id: "q1",
                question: "If the bid is ₹100 and ask is ₹102, what is the spread?",
                options: [
                  "₹100",
                  "₹102",
                  "₹2",
                  "₹202"
                ],
                correctIndex: 2,
                explanation: "Spread = Ask - Bid = ₹102 - ₹100 = ₹2"
              },
              {
                id: "q2",
                question: "Which type of option typically has the tightest spread?",
                options: [
                  "Deep OTM options",
                  "ATM options on liquid indices",
                  "Illiquid stock options",
                  "Long-dated options"
                ],
                correctIndex: 1,
                explanation: "ATM options on liquid indices like Nifty have the highest trading volume and therefore the tightest spreads."
              },
              {
                id: "q3",
                question: "A limit order:",
                options: [
                  "Executes immediately at any price",
                  "Specifies a maximum/minimum price for execution",
                  "Is free of brokerage",
                  "Can only be used for futures"
                ],
                correctIndex: 1,
                explanation: "Limit orders let you specify your price, helping you avoid paying the full spread."
              }
            ]
          }
        ],
        finalQuiz: [
          {
            id: "mq1",
            question: "Option premium consists of:",
            options: [
              "Only intrinsic value",
              "Only time value",
              "Intrinsic value + Time value",
              "Bid + Ask"
            ],
            correctIndex: 2,
            explanation: "Total premium = Intrinsic Value (immediate exercise value) + Time Value (potential future value)."
          },
          {
            id: "mq2",
            question: "As expiry approaches, what happens to time value?",
            options: [
              "It increases",
              "It decreases (theta decay)",
              "It stays constant",
              "It becomes negative"
            ],
            correctIndex: 1,
            explanation: "Time value decays as expiry approaches—this is theta decay, a key concept for options traders."
          },
          {
            id: "mq3",
            question: "Wide bid-ask spreads indicate:",
            options: [
              "High liquidity",
              "Low liquidity or high volatility",
              "Cheap options",
              "Bullish sentiment"
            ],
            correctIndex: 1,
            explanation: "Wide spreads typically indicate low liquidity or high volatility—both increase trading costs."
          },
          {
            id: "mq4",
            question: "Futures typically trade at a premium to spot because of:",
            options: [
              "Broker fees",
              "Government taxes",
              "Cost of carry",
              "Dividend payments"
            ],
            correctIndex: 2,
            explanation: "Cost of carry (interest cost of financing the position) causes futures to trade above spot price."
          },
          {
            id: "mq5",
            question: "The Greek 'Vega' measures sensitivity to:",
            options: [
              "Time decay",
              "Interest rates",
              "Volatility changes",
              "Price movements"
            ],
            correctIndex: 2,
            explanation: "Vega measures how much an option's price changes when implied volatility changes."
          }
        ]
      },
      {
        id: "calls-puts-intuition",
        title: "Intuition for Calls & Puts",
        description: "Develop intuitive understanding of option behavior",
        icon: "🎯",
        lessons: [
          {
            id: "call-put-scenarios",
            title: "When to Use Calls vs Puts",
            objective: "Build intuition for selecting the right option type based on market outlook.",
            content: `Knowing when to buy calls versus puts is fundamental. Let's build your intuition with real-world scenarios.

**The Decision Framework**

| Market View | Option Choice | Why |
|------------|---------------|-----|
| Bullish (prices rising) | Buy Call | Profit from upside |
| Bearish (prices falling) | Buy Put | Profit from downside |
| Neutral-Bullish | Sell Put | Collect premium if stable/up |
| Neutral-Bearish | Sell Call | Collect premium if stable/down |

**Scenario 1: Budget Announcement**

You expect Nifty to rally post-budget. Your options:
- **Buy Nifty Call**: Limited risk (premium), unlimited upside
- **Buy Nifty Futures**: More capital required, but no time decay
- **Sell Nifty Put**: Collect premium, but unlimited downside risk

*Best for beginners:* Buy call—defined risk, unlimited reward.

**Scenario 2: RBI Policy Uncertainty**

Bank stocks might move big, but direction unclear.
- **Buy Straddle**: Buy both call and put (profit from big move either way)
- **Avoid selling options**: Unlimited risk if big move happens

**Scenario 3: Slow Grind Up Expected**

You expect gradual Nifty appreciation over weeks.
- **Buy slightly ITM call**: Less time decay than OTM
- **Consider longer expiry**: More time for your view to play out
- **Avoid weekly OTM calls**: They decay fast

**The Moneyness Factor**

Strike selection matters as much as direction:

| Strike Type | Call Premium | Put Premium | Risk/Reward |
|-------------|--------------|-------------|-------------|
| ITM | High | High | Lower risk, lower leverage |
| ATM | Medium | Medium | Balanced |
| OTM | Low | Low | Higher risk, higher leverage |

**Key Insights**

1. **OTM options are cheap but have lower probability of profit**
2. **ITM options cost more but move more like the underlying**
3. **ATM options have the highest time value decay**
4. **Weeklies decay faster than monthlies**`,
            keyTakeaways: [
              "Bullish → Buy Calls; Bearish → Buy Puts",
              "Strike selection (ITM/ATM/OTM) affects risk-reward profile",
              "Weeklies decay faster—use for quick trades only",
              "Match your option choice to your conviction and timeframe"
            ],
            faqs: [
              {
                question: "Can I be wrong about direction but still profit?",
                answer: "Yes, if you're an option seller and the move is smaller than expected, you keep premium. Buyers need the move to happen to profit."
              },
              {
                question: "What if I'm unsure about direction but expect volatility?",
                answer: "Consider a straddle (buy both ATM call and put) or strangle (buy OTM call and put). You profit from big moves in either direction."
              },
              {
                question: "Should I always buy ATM options?",
                answer: "Not necessarily. ATM options have highest time value (and theta decay). ITM options have less time value and more intrinsic value."
              }
            ],
            quiz: [
              {
                id: "q1",
                question: "You expect Reliance to fall after poor quarterly results. You should:",
                options: [
                  "Buy a Call option",
                  "Buy a Put option",
                  "Sell a Put option",
                  "Do nothing"
                ],
                correctIndex: 1,
                explanation: "Expecting a fall means you're bearish—buy puts to profit from downside with limited risk."
              },
              {
                id: "q2",
                question: "OTM options are attractive because they:",
                options: [
                  "Have no time decay",
                  "Are cheaper but have lower probability of profit",
                  "Always make money",
                  "Have no expiry date"
                ],
                correctIndex: 1,
                explanation: "OTM options cost less but require a bigger move to become profitable—classic risk/reward tradeoff."
              },
              {
                id: "q3",
                question: "For a quick overnight trade, which option would decay fastest?",
                options: [
                  "3-month expiry ITM call",
                  "1-week expiry ATM call",
                  "1-month expiry OTM call",
                  "All decay at the same rate"
                ],
                correctIndex: 1,
                explanation: "Shorter expiry options (weeklies) decay much faster than longer-dated options, especially near ATM."
              }
            ]
          }
        ],
        finalQuiz: [
          {
            id: "mq1",
            question: "A bullish trader with limited capital should consider:",
            options: [
              "Buying calls",
              "Selling puts",
              "Buying stocks on margin",
              "Selling calls"
            ],
            correctIndex: 0,
            explanation: "Buying calls offers bullish exposure with limited risk and lower capital requirement."
          },
          {
            id: "mq2",
            question: "ITM options have:",
            options: [
              "Only time value, no intrinsic value",
              "Both intrinsic and time value",
              "No value at all",
              "Only gamma"
            ],
            correctIndex: 1,
            explanation: "ITM options have both intrinsic value (immediate exercise value) and some time value."
          },
          {
            id: "mq3",
            question: "When is buying a straddle appropriate?",
            options: [
              "When you expect no movement",
              "When you expect a big move but unsure of direction",
              "When you are slightly bullish",
              "When you want to collect premium"
            ],
            correctIndex: 1,
            explanation: "Straddles profit from large moves in either direction—ideal when expecting volatility but uncertain about direction."
          },
          {
            id: "mq4",
            question: "Weekly options compared to monthly options:",
            options: [
              "Have slower time decay",
              "Have faster time decay",
              "Decay at the same rate",
              "Never expire"
            ],
            correctIndex: 1,
            explanation: "Weekly options have accelerated theta decay, making them risky to hold but useful for quick trades."
          }
        ]
      },
      {
        id: "leverage-hedging",
        title: "Leverage, Hedging, and Index Significance",
        description: "Understand the power and risks of leveraged trading",
        icon: "🔒",
        lessons: [
          {
            id: "leverage-explained",
            title: "The Double-Edged Sword of Leverage",
            objective: "Understand how leverage amplifies both gains and losses in derivatives trading.",
            content: `Leverage is the defining feature of derivatives—and its most dangerous aspect. Let's understand how to use it wisely.

**What is Leverage?**

Leverage lets you control a large position with a small amount of capital. It's like a loan from the market.

*Example:* Nifty at 22,000. One lot = 50 units = ₹11,00,000 exposure.
- With futures (15% margin): ₹1,65,000 controls ₹11,00,000 → 6.7x leverage
- With ATM call (₹200 premium): ₹10,000 controls ₹11,00,000 → 110x leverage!

**Leverage Calculation**

Leverage = Notional Exposure ÷ Capital Required

**The Amplification Effect**

| Nifty Move | Spot Position Return | Futures Return (6.7x) | ATM Call Return (110x) |
|------------|---------------------|----------------------|------------------------|
| +2% | +2% | +13.4% | Could be +100%+ |
| -2% | -2% | -13.4% | Could be -50% or more |

**The Risk of Ruin**

High leverage can wipe out your account quickly:

*Scenario:* You have ₹1,00,000. You use full leverage to buy futures.
- A 10% adverse move = ₹6,70,000 loss on ₹11,00,000 position
- Your ₹1,00,000 is wiped out, and you may owe more!

**Position Sizing Rules**

1. **Never risk more than 2% of capital on a single trade**
2. **Calculate position size based on stop loss, not leverage available**
3. **Account for worst-case scenarios (gaps, circuit limits)**
4. **Keep leverage below 3x for beginners**

**The Option Advantage**

Buying options provides natural leverage with defined risk:
- Maximum loss = Premium paid
- No margin calls
- Position can't go negative

*This is why beginners should start with buying options, not futures.*`,
            keyTakeaways: [
              "Leverage amplifies both profits AND losses",
              "Options provide high leverage with defined risk",
              "Position sizing is more important than potential returns",
              "Beginners should keep leverage low and use bought options"
            ],
            faqs: [
              {
                question: "Can I lose more money than I invested in derivatives?",
                answer: "With futures and sold options, YES—you can lose more than your margin. With bought options, NO—your loss is limited to premium paid."
              },
              {
                question: "What's a good leverage level for a beginner?",
                answer: "Keep effective leverage under 3x initially. As you gain experience and develop risk management skills, you can gradually increase."
              },
              {
                question: "Why do experienced traders use less leverage than available?",
                answer: "Experienced traders know that survival matters more than maximizing returns. Lower leverage means you can withstand adverse moves and drawdowns."
              }
            ],
            quiz: [
              {
                id: "q1",
                question: "If you use 10x leverage and the underlying moves 5% against you, your loss is:",
                options: [
                  "5%",
                  "10%",
                  "50%",
                  "100%"
                ],
                correctIndex: 2,
                explanation: "With 10x leverage, a 5% adverse move results in a 50% loss (5% × 10 = 50%)."
              },
              {
                id: "q2",
                question: "The safest way to get leverage exposure for a beginner is:",
                options: [
                  "Selling naked options",
                  "Buying futures on margin",
                  "Buying options",
                  "Using maximum available leverage"
                ],
                correctIndex: 2,
                explanation: "Buying options provides leverage with defined, limited risk—ideal for beginners."
              },
              {
                id: "q3",
                question: "Position sizing should be based on:",
                options: [
                  "Maximum leverage available",
                  "Your stop loss and risk per trade",
                  "Current market volatility only",
                  "Broker recommendations"
                ],
                correctIndex: 1,
                explanation: "Calculate position size based on where you'll exit if wrong (stop loss) and how much you can afford to lose (risk per trade)."
              }
            ]
          },
          {
            id: "hedging-strategies",
            title: "Hedging Your Portfolio",
            objective: "Learn practical hedging techniques to protect your investments.",
            content: `Hedging is using derivatives to reduce risk in your existing positions. Think of it as insurance for your portfolio.

**Why Hedge?**

You may have a stock portfolio you don't want to sell, but you're worried about a market crash. Hedging lets you protect value without liquidating.

**Common Hedging Strategies**

**1. Protective Put (Portfolio Insurance)**

You own Nifty stocks worth ₹10 lakhs. Buy Nifty puts to protect against downside.

*Example:* 
- Portfolio value: ₹10,00,000
- Buy Nifty 21500 Put at ₹150 for 2 lots (100 units)
- Cost: ₹15,000 (1.5% of portfolio)
- If Nifty crashes to 20,000, puts gain ₹1,50,000, offsetting stock losses

**2. Covered Call (Income Generation)**

You own TCS shares and don't expect much upside. Sell calls to earn income.

*Example:*
- Own 500 TCS shares at ₹3,800
- Sell 3900 Call at ₹40
- Collect: ₹20,000 premium
- Trade-off: If TCS rallies above 3900, you miss gains beyond that

**3. Collar Strategy (Limited Risk/Reward)**

Combine protective put + covered call for a zero-cost hedge.

*Example:*
- Own stocks
- Buy OTM put (protection)
- Sell OTM call (pay for the put)
- Result: Limited downside, limited upside, minimal cost

**Hedging Principles**

1. **Hedge ratio matters**: Match hedge size to your exposure
2. **Cost consideration**: Hedging isn't free—factor in premium cost
3. **Don't over-hedge**: You might miss profitable moves
4. **Roll hedges**: Renew protection before expiry

**When to Hedge**

- Before known events (earnings, elections, RBI policy)
- When you can't monitor markets closely
- When portfolio has concentrated positions
- When you've hit profit targets but want to stay invested`,
            keyTakeaways: [
              "Protective puts act as portfolio insurance against crashes",
              "Covered calls generate income but cap upside potential",
              "Collars provide balanced protection at low cost",
              "Match your hedge size to your actual exposure"
            ],
            faqs: [
              {
                question: "Is hedging worth the cost?",
                answer: "That depends on your risk tolerance and the probability of adverse moves. Think of it like insurance—you hope not to use it, but it provides peace of mind."
              },
              {
                question: "Can hedging guarantee no losses?",
                answer: "Perfect hedging is rarely possible or practical. Hedging reduces risk but may not eliminate it entirely."
              },
              {
                question: "Should I hedge my entire portfolio?",
                answer: "Not necessarily. Partial hedging is often more practical, protecting against severe losses while maintaining some upside exposure."
              }
            ],
            quiz: [
              {
                id: "q1",
                question: "A protective put strategy involves:",
                options: [
                  "Selling puts against your stock",
                  "Buying puts to protect your stock holdings",
                  "Buying calls for upside",
                  "Selling your stock and buying puts"
                ],
                correctIndex: 1,
                explanation: "Protective puts involve buying put options to protect existing stock holdings from downside risk."
              },
              {
                id: "q2",
                question: "The trade-off in a covered call strategy is:",
                options: [
                  "Unlimited risk for limited reward",
                  "Premium income in exchange for capping upside",
                  "No trade-offs—it's always profitable",
                  "High cost for protection"
                ],
                correctIndex: 1,
                explanation: "Covered calls earn premium income but limit your profit if the stock rallies beyond the strike price."
              },
              {
                id: "q3",
                question: "A collar strategy combines:",
                options: [
                  "Two calls",
                  "Two puts",
                  "A protective put and covered call",
                  "Futures and options"
                ],
                correctIndex: 2,
                explanation: "Collars combine buying puts (protection) with selling calls (to offset the put cost)."
              }
            ]
          }
        ],
        finalQuiz: [
          {
            id: "mq1",
            question: "With 5x leverage, a 10% gain in the underlying results in:",
            options: [
              "10% profit",
              "50% profit",
              "5% profit",
              "100% profit"
            ],
            correctIndex: 1,
            explanation: "Leverage multiplies returns: 10% × 5 = 50% profit."
          },
          {
            id: "mq2",
            question: "The maximum loss when buying options is:",
            options: [
              "Unlimited",
              "The premium paid",
              "The margin required",
              "The strike price"
            ],
            correctIndex: 1,
            explanation: "Option buyers can only lose the premium they paid—this is the key risk-limiting feature of buying options."
          },
          {
            id: "mq3",
            question: "A protective put is most useful when:",
            options: [
              "You want maximum leverage",
              "You own stocks and fear a market decline",
              "You want to generate income",
              "You are very bullish"
            ],
            correctIndex: 1,
            explanation: "Protective puts insure your stock holdings against decline—perfect for when you're worried about downside."
          },
          {
            id: "mq4",
            question: "Covered calls are appropriate when you expect:",
            options: [
              "A big rally",
              "A crash",
              "Sideways to slightly bullish movement",
              "Extreme volatility"
            ],
            correctIndex: 2,
            explanation: "Covered calls work best in neutral to slightly bullish markets where the stock stays below the strike."
          },
          {
            id: "mq5",
            question: "The safest approach for a beginner trader is:",
            options: [
              "Maximum leverage for maximum returns",
              "Limited leverage with bought options",
              "Selling naked options",
              "Day trading futures"
            ],
            correctIndex: 1,
            explanation: "Beginners should use limited leverage and bought options (defined risk) to learn while protecting capital."
          }
        ]
      }
    ],
    finalAssessment: [
      {
        id: "la1",
        question: "Derivatives get their value from:",
        options: [
          "Government bonds",
          "An underlying asset",
          "Central bank policy",
          "Brokerage firms"
        ],
        correctIndex: 1,
        explanation: "The defining characteristic of derivatives is that they derive value from an underlying asset."
      },
      {
        id: "la2",
        question: "The key difference between futures and options is:",
        options: [
          "Only options trade on exchanges",
          "Futures are obligations, options are rights",
          "Options don't have expiry dates",
          "Futures don't require margin"
        ],
        correctIndex: 1,
        explanation: "Futures obligate both parties; options give the buyer a right while the seller has an obligation."
      },
      {
        id: "la3",
        question: "If you buy a put option, you profit when:",
        options: [
          "The underlying rises",
          "The underlying falls",
          "Volatility decreases",
          "Interest rates rise"
        ],
        correctIndex: 1,
        explanation: "Put options give the right to sell, so they profit when prices fall."
      },
      {
        id: "la4",
        question: "Theta in options trading represents:",
        options: [
          "Volatility sensitivity",
          "Time decay",
          "Price sensitivity",
          "Interest rate sensitivity"
        ],
        correctIndex: 1,
        explanation: "Theta measures how much an option loses value each day due to time decay."
      },
      {
        id: "la5",
        question: "A tight bid-ask spread indicates:",
        options: [
          "Low liquidity",
          "High volatility",
          "High liquidity",
          "Market manipulation"
        ],
        correctIndex: 2,
        explanation: "Tight spreads indicate high liquidity—many buyers and sellers are active."
      },
      {
        id: "la6",
        question: "With 10x leverage, a 5% adverse move results in what loss on your capital?",
        options: [
          "5%",
          "15%",
          "50%",
          "10%"
        ],
        correctIndex: 2,
        explanation: "Leverage multiplies both gains and losses: 5% × 10 = 50% loss."
      },
      {
        id: "la7",
        question: "A hedger uses derivatives to:",
        options: [
          "Speculate on price moves",
          "Protect against adverse price moves",
          "Provide liquidity",
          "Earn brokerage commissions"
        ],
        correctIndex: 1,
        explanation: "Hedgers use derivatives to protect existing positions from adverse price movements."
      },
      {
        id: "la8",
        question: "ATM options have the highest:",
        options: [
          "Intrinsic value",
          "Time value",
          "Delta",
          "Leverage"
        ],
        correctIndex: 1,
        explanation: "At-the-money options have the highest time value component because they have the most uncertainty about finishing ITM or OTM."
      },
      {
        id: "la9",
        question: "Mark-to-Market (MTM) applies to:",
        options: [
          "Only options",
          "Only futures",
          "Both equally",
          "Neither"
        ],
        correctIndex: 1,
        explanation: "MTM is a feature of futures trading where positions are settled daily."
      },
      {
        id: "la10",
        question: "The maximum loss for an option buyer is:",
        options: [
          "Unlimited",
          "The premium paid",
          "The strike price",
          "The underlying value"
        ],
        correctIndex: 1,
        explanation: "Option buyers can only lose the premium they paid—their risk is defined and limited."
      }
    ]
  },
  {
    id: "intermediate",
    title: "Intermediate",
    description: "Advanced strategies and risk management",
    modules: [
      {
        id: "option-greeks-deep",
        title: "Deep Dive into Option Greeks",
        description: "Master Delta, Gamma, Theta, and Vega",
        icon: "📐",
        lessons: [],
        finalQuiz: []
      },
      {
        id: "volatility-trading",
        title: "Volatility Trading Strategies",
        description: "Learn to trade volatility, not just direction",
        icon: "📈",
        lessons: [],
        finalQuiz: []
      },
      {
        id: "spread-strategies",
        title: "Option Spread Strategies",
        description: "Vertical, horizontal, and diagonal spreads",
        icon: "📊",
        lessons: [],
        finalQuiz: []
      },
      {
        id: "risk-management",
        title: "Professional Risk Management",
        description: "Position sizing, portfolio Greeks, and drawdown control",
        icon: "🛡️",
        lessons: [],
        finalQuiz: []
      }
    ],
    finalAssessment: []
  },
  {
    id: "advanced",
    title: "Advanced",
    description: "Professional trading techniques and market microstructure",
    modules: [
      {
        id: "exotic-options",
        title: "Exotic Options and Structured Products",
        description: "Barriers, Asians, and custom payoffs",
        icon: "💎",
        lessons: [],
        finalQuiz: []
      },
      {
        id: "market-microstructure",
        title: "Market Microstructure",
        description: "Order flow, market making, and execution",
        icon: "⚙️",
        lessons: [],
        finalQuiz: []
      },
      {
        id: "systematic-trading",
        title: "Systematic Trading Approaches",
        description: "Algorithm design and backtesting",
        icon: "🤖",
        lessons: [],
        finalQuiz: []
      },
      {
        id: "portfolio-strategies",
        title: "Institutional Portfolio Strategies",
        description: "Multi-asset hedging and tail risk management",
        icon: "🏛️",
        lessons: [],
        finalQuiz: []
      }
    ],
    finalAssessment: []
  }
];

export const getLevelById = (levelId: string): Level | undefined => {
  return courseData.find(level => level.id === levelId);
};

export const getModuleById = (levelId: string, moduleId: string): Module | undefined => {
  const level = getLevelById(levelId);
  return level?.modules.find(module => module.id === moduleId);
};

export const getLessonById = (levelId: string, moduleId: string, lessonId: string): Lesson | undefined => {
  const module = getModuleById(levelId, moduleId);
  return module?.lessons.find(lesson => lesson.id === lessonId);
};
