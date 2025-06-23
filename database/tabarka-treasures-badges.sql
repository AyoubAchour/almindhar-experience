-- Tabarka Treasures Game Badges
-- Insert new badge definitions for the Tabarka Treasures game

-- 1. Premier Plongeur - First time playing Tabarka Treasures
INSERT INTO public.badges (name, label, description) 
VALUES (
  'premier_plongeur',
  'Premier Plongeur',
  'Complété votre premier jeu Tabarka Treasures'
) ON CONFLICT (name) DO NOTHING;

-- 2. Collecteur Trésor - Collect 50+ treasures in a single game
INSERT INTO public.badges (name, label, description) 
VALUES (
  'collecteur_tresor',
  'Collecteur Trésor',
  'Collecté 50+ trésors en un seul jeu'
) ON CONFLICT (name) DO NOTHING;

-- 3. Maître Plongeur - Achieve high score (100+ points)
INSERT INTO public.badges (name, label, description) 
VALUES (
  'maitre_plongeur',
  'Maître Plongeur',
  'Atteint un score de 100+ points'
) ON CONFLICT (name) DO NOTHING;

-- 4. Explorateur Tabarka - Complete 5 games
INSERT INTO public.badges (name, label, description) 
VALUES (
  'explorateur_tabarka',
  'Explorateur Tabarka',
  'Complété 5 jeux Tabarka Treasures'
) ON CONFLICT (name) DO NOTHING;

-- Verify the badges were created
SELECT id, name, label, description, created_at 
FROM public.badges 
WHERE name IN ('premier_plongeur', 'collecteur_tresor', 'maitre_plongeur', 'explorateur_tabarka')
ORDER BY created_at DESC;
