-- ============================================================
-- Seed: Mechanic Resources (Tutorials and Custom Training Maps)
-- ============================================================

insert into public.mechanic_resources (mechanic_id, type, title, video_url, map_code)
select
  m.id,
  r.type,
  r.title,
  r.video_url,
  r.map_code
from (
  values
    -- Movement fundamentals
    ('wave-dash', 'video', 'Wayton Pilkin - Ultimate Wavedash Guide', 'https://www.youtube.com/watch?v=wxVpT5sA3dc', null),
    ('wave-dash', 'map_code', 'Wavedash Recovery Practice', null, '77AC-11C2-824A-215F'),

    ('half-flip', 'video', 'Thanovic - How To Half Flip in Rocket League', 'https://www.youtube.com/watch?v=3C47vYg8V_w', null),
    ('half-flip', 'map_code', 'Half Flip & Recovery Consistency', null, 'B816-6B0C-17CA-9937'),

    ('fast-aerial', 'video', 'Wayton Pilkin - Fast Aerial Tutorial & Common Mistakes', 'https://www.youtube.com/watch?v=gW7ZzU8vH4w', null),
    ('fast-aerial', 'map_code', 'Fast Aerial Mastery Pack', null, '4C4A-5764-EA0D-255B'),

    ('speedflip', 'video', 'Musty - How to Speed Flip (Official Guide)', 'https://www.youtube.com/watch?v=yoxz12Gv8cM', null),
    ('speedflip', 'map_code', 'Musty Speedflip Test Pack', null, 'A503-264C-A7EB-D282'),

    ('zap-dash', 'video', 'Fetch - Zap Dash Tutorial: Unlimited Speed', 'https://www.youtube.com/watch?v=Qf6V4Hj7yKg', null),
    ('zap-dash', 'map_code', 'Zap Dash Ground Recovery', null, '1F4B-659A-5CCB-3D24'),

    -- Dribble & flicks
    ('ground-dribble', 'video', 'Wayton Pilkin - Master Ground Dribbling & Ball Control', 'https://www.youtube.com/watch?v=83x4rF13rHQ', null),
    ('ground-dribble', 'map_code', 'Poquito - Dribble Training Pack', null, '7067-44F0-A1C8-7DDD'),

    ('front-flip-flick', 'video', 'Virge - Basic Flicks & Car Placement Guide', 'https://www.youtube.com/watch?v=83nC-VqWw1Q', null),
    ('front-flip-flick', 'map_code', 'Basic Flicks Practice Pack', null, '6D94-3D96-4F2F-BA84'),

    ('45-flick', 'video', 'King Ranny - How to 45 Degree Flick Like a Pro', 'https://www.youtube.com/watch?v=qj6r_V49gC4', null),
    ('45-flick', 'map_code', '45 Degree Flick Master', null, 'B2AC-C869-9BE6-5CE8'),

    ('90-flick', 'video', 'Evample - Consistent 90 Degree Flicks Tutorial', 'https://www.youtube.com/watch?v=yE3VwA20j8A', null),
    ('90-flick', 'map_code', 'Side Flicks & 90 Flicks', null, '52AC-744E-229D-D895'),

    ('180-flick', 'video', 'Wayton Pilkin - The Most Powerful Flicks Ranked', 'https://www.youtube.com/watch?v=L9wW6Uq_o7o', null),
    ('180-flick', 'map_code', '180 Backward Flicks Training', null, 'E29B-452C-6C18-936A'),

    ('musty-flick', 'video', 'amustycow - How to Musty Flick', 'https://www.youtube.com/watch?v=0k7U55vPq0c', null),
    ('musty-flick', 'map_code', 'Musty Flick Setup & Execution', null, '4BD7-DD15-4D78-3FBB'),

    -- Air dribbles & aerials
    ('air-dribble', 'video', 'Thanovic - Complete Air Dribble Step-by-Step Guide', 'https://www.youtube.com/watch?v=5B4HW_XkF_w', null),
    ('air-dribble', 'map_code', 'IP Joker - Wall to Air Dribble', null, '0FB6-C16F-D724-40E7'),

    ('ceiling-shot', 'video', 'Fluump - How To Ceiling Shot Tutorial', 'https://www.youtube.com/watch?v=G3q9QZ1L2aM', null),
    ('ceiling-shot', 'map_code', 'Ceiling Shots Progression Pack', null, 'CC59-6D55-08CE-BD7C'),

    ('flip-reset', 'video', 'Thanovic - The Only Flip Reset Tutorial You Need', 'https://www.youtube.com/watch?v=mZ7rV8xPq6c', null),
    ('flip-reset', 'map_code', 'Flip Reset Consistency Pack', null, '8D93-C997-0AC5-8B9F'),

    ('double-touch', 'video', 'Wayton Pilkin - How to Double Tap & Read the Backboard', 'https://www.youtube.com/watch?v=B9JkGZfV2_Y', null),
    ('double-touch', 'map_code', 'Double Tap Playground', null, '23BC-0377-C228-A338'),

    -- Pinches
    ('ground-pinch', 'video', 'Pulse Fire - The Ultimate Ground Pinch Tutorial', 'https://www.youtube.com/watch?v=wX02-Y98g7w', null),
    ('ground-pinch', 'map_code', 'Ground Pinch Angles & Power', null, '3F0E-07F1-3DB8-2DEB'),

    ('wall-pinch', 'video', 'Thanovic - How to Wall Pinch like Kuxir', 'https://www.youtube.com/watch?v=Yp69bE_QZdc', null),
    ('wall-pinch', 'map_code', 'Kuxir Wall Pinch Practice', null, '494D-BAF6-2E32-E8B6'),

    -- Saves & defense
    ('shadow-defense', 'video', 'SunlessKhan - Why You Suck at Shadow Defense', 'https://www.youtube.com/watch?v=0sZ32fR903E', null),
    ('shadow-defense', 'map_code', 'Poquito - Shadow Defense Pack', null, '5CCE-FB29-7B05-A0B1'),

    ('aerial-save', 'video', 'Virge - Goalkeeping & Aerial Saves in Rocket League', 'https://www.youtube.com/watch?v=N6R98b1s778', null),
    ('aerial-save', 'map_code', 'Poquito - Saves Training Pack', null, '2E23-ABD5-20EE-D7D8'),

    -- Power shots & redirects
    ('power-shot', 'video', 'Wayton Pilkin - How to Shoot with Maximum Power & Accuracy', 'https://www.youtube.com/watch?v=680g9n7c1oI', null),
    ('power-shot', 'map_code', 'Poquito - Ground Shots Training Pack', null, '6EB1-7923-BD42-B363'),

    ('aerial-redirect', 'video', 'Thanovic - Redirects Tutorial & Aerial Car Control', 'https://www.youtube.com/watch?v=C4r4m5nKq8s', null),
    ('aerial-redirect', 'map_code', 'Poquito - Aerial Shots - Pass', null, 'C7E0-9E0B-B73C-23B8'),

    -- Strategy, rotations & demos
    ('boost-management', 'video', 'AppJack - Boost Pathing & Small Pad Efficiency Guide', 'https://www.youtube.com/watch?v=p1X6F45t8zE', null),
    ('boost-management', 'video', 'SpookLuke - The 100 Boost Mistake Everyone Makes', 'https://www.youtube.com/watch?v=Mh50aQoK8B8', null),

    ('rotation', 'video', 'Gregan - Tabletop Tactics: Rotations & Positioning', 'https://www.youtube.com/watch?v=8t_j576L2pY', null),
    ('rotation', 'video', 'SunlessKhan - Complete 2v2 and 3v3 Rotations Guide', 'https://www.youtube.com/watch?v=UqE1mSg_Y5c', null),

    ('demos', 'video', 'Woody - The Art of Demolitions & Bump Plays', 'https://www.youtube.com/watch?v=Y4gB8vW71Z4', null),
    ('demos', 'video', 'SunlessKhan - How To Win Using Tactical Demos', 'https://www.youtube.com/watch?v=9j71B_vY12Y', null),

    -- Pogo
    ('pogo', 'video', 'Pulse Henkovic - How to Pogo & Planing In Rocket League', 'https://www.youtube.com/watch?v=0k5fR9hQ1bA', null),
    ('pogo', 'map_code', 'Freestyle Pogo & Bounce Setup', null, '3B5D-626F-D891-B763')
) as r(mechanic_slug, type, title, video_url, map_code)
join public.mechanics m on m.slug = r.mechanic_slug;
