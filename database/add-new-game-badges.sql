-- Add new badges for Desert game and cross-game achievements
-- Run this SQL in your Supabase SQL editor

INSERT INTO badges (name, label, description, created_at) VALUES 
('premier_chamelier', 'Premier Chamelier', 'Complété votre premier voyage dans le désert', NOW()),
('voyageur_desert', 'Voyageur du Désert', 'Parcouru 500+ mètres en un seul voyage', NOW()),
('maitre_chamelier', 'Maître Chamelier', 'Atteint un score de 80+ points (800+ mètres)', NOW()),
('explorateur_tunisie', 'Explorateur de Tunisie', 'Complété tous les jeux au moins une fois', NOW())
ON CONFLICT (name) DO NOTHING;

-- Verify the badges were added
SELECT name, label, description FROM badges 
WHERE name IN ('premier_chamelier', 'voyageur_desert', 'maitre_chamelier', 'explorateur_tunisie')
ORDER BY name; 