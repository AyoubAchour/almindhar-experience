import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { couponCode } = await request.json();
    if (!couponCode) {
      return NextResponse.json({ valid: false, error: 'Coupon code is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ valid: false, error: 'Authentication required' }, { status: 401 });
    }

    // Find the user's coupon record
    const { data: userReward, error: urError } = await supabase
      .from('user_rewards')
      .select('*')
      .eq('user_id', user.id)
      .eq('coupon_code', couponCode)
      .single();
    if (urError || !userReward) {
      return NextResponse.json({ valid: false, error: 'Coupon not found' }, { status: 404 });
    }

    // Check expiration
    if (new Date(userReward.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, error: 'Coupon expired' }, { status: 400 });
    }

    // Fetch associated reward to get discount percent
    const { data: reward, error: rError } = await supabase
      .from('rewards')
      .select('id, discount_percent')
      .eq('id', userReward.reward_id)
      .single();
    if (rError || !reward) {
      return NextResponse.json({ valid: false, error: 'Associated reward not found' }, { status: 500 });
    }

    return NextResponse.json({
      valid: true,
      rewardId: userReward.reward_id,
      discountPercent: reward.discount_percent
    });
  } catch (error: any) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ valid: false, error: error.message || 'Unexpected error' }, { status: 500 });
  }
} 