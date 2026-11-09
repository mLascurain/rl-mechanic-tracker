-- Additional resources are curated public data. Re-running this insert is safe.
with additions(slug, type, title, video_url, map_code) as (values
('musty-flick','map_code','Yeeza — Delayed Flicks',null,'3337-A6D5-AFF9-C2C6'),
('air-dribble','map_code','WayProtein — Realistic Air Dribbles',null,'D74D-FB19-06F3-CC67'),
('fast-aerial','map_code','Millennium — Fast Aerials/Redirects',null,'24A2-849A-610E-C67C'),
('kuxir-pinch','map_code','Kaneki Ken — Kuxir Pinch Training',null,'B598-D3E9-7BB9-3EC8'),
('flip-reset','map_code','Torment — Flip Reset Shots',null,'2186-5167-B7C8-C46F'),
('double-touch','map_code','Trifecta Illixer — Double Touch Read Practice',null,'0321-6855-BCBD-5A04'),
('redirect','map_code','HeitorCar — Redirect',null,'4B34-668E-8D1B-05BC'),
('fast-aerial','video','Virge — Rocket League Fast Aerial Tutorial','https://www.youtube.com/watch?v=10jGIo1n8hg',null),
('half-flip','video','ApparentlyJack — BEST HALF FLIP TUTORIAL (2021)','https://www.youtube.com/watch?v=PioMaTXS2WI',null),
('air-dribble','video','Wayton Pilkin — How To AIR DRIBBLE from Beginner To Advanced','https://www.youtube.com/watch?v=ddEe3t_cKyw',null),
('ceiling-shot','video','Virge — Rocket League Ceiling Shot Tutorial','https://www.youtube.com/watch?v=W2oyty2-TxA',null),
('ceiling-shot','map_code','Virge — Ceiling Shot Training Pack',null,'413F-B781-CD99-33D7'),
('flip-reset','video','SpookyLuke — The Ultimate Flip Reset Tutorial','https://www.youtube.com/watch?v=ESxkKkvD_uM',null),
('musty-flick','video','James RL — How to Musty Flick + Training Pack','https://www.youtube.com/watch?v=7KQcfj3jYiI',null),
('musty-flick','map_code','James RL — Musty Flick Training Pack',null,'6614-D9A2-8D61-D6BC'),
('ceiling-shot','video','JZR — Ceiling Shot (Advanced Aerial)','https://www.youtube.com/watch?v=wtGtYPxnRK8',null),
('wave-dash','video','Sir Timbers — Wavedash Tutorial','https://www.youtube.com/watch?v=qG-ZK2ocAzw',null),
('ground-dribble','video','SquishyMuffinz — Basics of Dribbling and Flicks','https://www.youtube.com/watch?v=Il7nZS3hKmA',null),
('half-flip','video','Sir Timbers — Half Flip Tutorial','https://www.youtube.com/watch?v=QfeD1udGfEs',null),
('musty-flick','video','Musty — Musty Flick Tutorial','https://www.youtube.com/watch?v=96tNxK5vTsQ',null),
('classy-flick','video','Kevpert — Tornado Flicks Mini-Tutorial','https://www.youtube.com/watch?v=Jsrm4u25sSk',null),
('speedflip','video','Flitz RL — Quick and Easy Speed Flip Tutorial','https://www.youtube.com/watch?v=41nSg_NlWr4',null)
)
insert into public.mechanic_resources (mechanic_id,type,title,video_url,map_code)
select m.id,a.type,a.title,a.video_url,a.map_code
from additions a join public.mechanics m on m.slug=a.slug
where not exists (
 select 1 from public.mechanic_resources r where r.mechanic_id=m.id and r.type=a.type
 and ((a.type='video' and r.video_url=a.video_url) or (a.type='map_code' and r.map_code=a.map_code))
);
-- This old spotlight row assigns the same code to half-flip and air-roll shots;
-- retain no misleading half-flip association.
delete from public.mechanic_resources where title='Shining Tuna — Half Flip Shots';
