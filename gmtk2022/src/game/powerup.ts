export enum PowerUp {
     reroll,
     pseudorandomReroll,
     twoDices,
     upwardReroll,
     downwardReroll,
     upsideDown
}


export function getPUTitle(p: PowerUp): String {
    switch (p) {
    case PowerUp.reroll: return "Reroll"
    case PowerUp.pseudorandomReroll: return "Pseudorandom Reroll"
    case PowerUp.twoDices: return "Two Dices"
    case PowerUp.upwardReroll: return "Upward Reroll"
    case PowerUp.downwardReroll: return "Downward Reroll"
    case PowerUp.upsideDown: return "Upside Down"
    }
}


//     var title: String {
//         switch self {
//         case .reroll: return "Reroll"
//         case .pseudorandomReroll: return "Pseudorandom Reroll"
//         case .twoDices: return "Two Dices"
//         case .upwardReroll: return "Upward Reroll"
//         case .downwardReroll: return "Downward Reroll"
//         case .upsideDown: return "Upside Down"
//         }
//     }

//     var shortTitle: String {
//         switch self {
//         case .reroll: return "Reroll"
//         case .pseudorandomReroll: return "Pseudo"
//         case .twoDices: return "Two Dices"
//         case .upwardReroll: return "Upward"
//         case .downwardReroll: return "Downward"
//         case .upsideDown: return "Upside Down"
//         }
//     }

//     var description: String {
//         switch self {
//         case .reroll:
//             return "Gives you opportunity to reroll the dice. Simple as that"
//         case .pseudorandomReroll:
//             return "You can reroll the dice, and it will show value that wasn't rolled today"
//         case .twoDices:
//             return "You roll 2 dices and it gives you 3 values at once: from the 1 dice, from the 2 dice and their sum"
//         case .upwardReroll:
//             return "Rerolled dice will show value more than the last roll. If two dices are rolled, it will be the value more than the one that has minimum value"
//         case .downwardReroll:
//             return "Rerolled dice will show value less than the last roll. If two dices are rolled, it will be the value less than the one that has maximum value"
//         case .upsideDown:
//             return "You can rotate the dice (or dices) upside down. Tip: the sum of opposite side values in the dice always equals 7"
//         }
//     }

//     var price: Int {
//         switch self {
//         case .reroll: return 7
//         case .pseudorandomReroll: return 12
//         case .twoDices: return 20
//         case .upwardReroll: return 24
//         case .downwardReroll: return 24
//         case .upsideDown: return 25
//         }
//     }

//     var imageName: String {
//         switch self {
//         case .reroll: return "reroll"
//         case .pseudorandomReroll: return "psreroll"
//         case .twoDices: return "two"
//         case .upwardReroll: return "up"
//         case .downwardReroll: return "down"
//         case .upsideDown: return "rotate"
//         }
//     }

//     static var all: [PowerUp] {
//         return [PowerUp.reroll, PowerUp.pseudorandomReroll, PowerUp.twoDices, PowerUp.upwardReroll, PowerUp.downwardReroll, PowerUp.upsideDown]
//     }
// }