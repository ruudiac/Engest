import { supabase } from "./supabase";

export async function loadShop() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: items } = await supabase.from("items").select("*");
  const { data: mine } = await supabase
    .from("user_items")
    .select("*")
    .eq("user_id", user.id);
  const { data: profile } = await supabase
    .from("profiles")
    .select("coins")
    .eq("id", user.id)
    .single();

  const shopItems = (items ?? []).map((item) => {
    const row = (mine ?? []).find((m) => m.item_id === item.id);
    return {
      ...item,
      owned: item.is_default || row !== undefined,
      equipped: row?.equipped ?? false,
    };
  });


  for (const item of shopItems) {
    if (item.is_default && !shopItems.some((o) => o.slot === item.slot && o.equipped)) {
      item.equipped = true;
    }
  }

  console.log("SHOP", shopItems);
  return { items: shopItems, coins: profile?.coins ?? 0 };
}

export async function buyItem(id: number) {
  const { data, error } = await supabase.rpc('buy_item', { p_item: id });
  if (error) throw new Error(error.message);
  return data as number;
}

export async function equipItem(id: number) {
  const { error } = await supabase.rpc('equip_item', { p_item: id });
  if (error) throw new Error(error.message);
}
