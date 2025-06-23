export interface CulturalFactData {
  [treasureType: string]: string[];
}

export class CulturalFacts {
  private static readonly facts: CulturalFactData = {
    star: [
      "Les étoiles de mer étaient considérées comme des guides spirituels par les plongeurs de Tabarka.",
      "Les étoiles de mer de Méditerranée peuvent régénérer leurs bras perdus, symbolisant la renaissance.",
      "Les plongeurs de Tabarka collectaient les étoiles de mer pour leurs propriétés décoratives uniques.",
      "Les étoiles de mer étaient utilisées dans l'artisanat traditionnel de Tabarka comme porte-bonheur."
    ],
    pottery: [
      "Les amphores trouvées au large de Tabarka témoignent du commerce maritime antique.",
      "Les potiers de Tabarka créaient des jarres spéciales pour conserver les produits de la mer.",
      "La céramique de Tabarka était réputée pour sa résistance à l'eau salée.",
      "Les plongeurs découvraient souvent des poteries phéniciennes dans les fonds marins."
    ],
    coins: [
      "Des pièces de monnaie carthaginoises ont été découvertes dans les eaux de Tabarka.",
      "Les marchands utilisaient Tabarka comme port de commerce depuis l'Antiquité.",
      "Les pièces romaines trouvées témoignent de l'importance commerciale de Tabarka.",
      "Le commerce du corail générait une richesse considérable pour la région."
    ],
    tools: [
      "Les outils de plongée traditionnels étaient fabriqués par les artisans locaux.",
      "Les plongeurs utilisaient des pierres lourdes pour descendre rapidement vers les récifs.",
      "Les couteaux spéciaux permettaient de détacher le corail sans l'endommager.",
      "Les filets de Tabarka étaient tissés avec des techniques ancestrales."
    ],
    pearls: [
      "Bien que rares, des perles naturelles étaient parfois trouvées dans les huîtres de Tabarka.",
      "Les nacres de Tabarka étaient utilisées pour décorer les objets précieux.",
      "La pêche aux huîtres perlières était une activité secondaire des plongeurs.",
      "Les perles de Méditerranée étaient moins communes mais très appréciées."
    ]
  };

  public static getRandomFact(treasureType: string): string {
    const treasureFacts = this.facts[treasureType];
    if (!treasureFacts || treasureFacts.length === 0) {
      return "Tabarka est célèbre pour ses traditions de plongée et de pêche au corail.";
    }

    const randomIndex = Math.floor(Math.random() * treasureFacts.length);
    return treasureFacts[randomIndex];
  }

  public static getAllFacts(treasureType: string): string[] {
    return this.facts[treasureType] || [];
  }

  public static getAllTreasureTypes(): string[] {
    return Object.keys(this.facts);
  }

  public static getFactCount(treasureType: string): number {
    return this.facts[treasureType]?.length || 0;
  }

  public static getTotalFactCount(): number {
    return Object.values(this.facts).reduce((total, facts) => total + facts.length, 0);
  }
}
