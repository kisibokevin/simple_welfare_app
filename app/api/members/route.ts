import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      orderBy: { number: 'asc' },
    });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { fullName } = await request.json();

    // Validate name
    if (!/^[A-Za-z\s]{3,}$/.test(fullName)) {
      return NextResponse.json({ error: 'Invalid full name' }, { status: 400 });
    }

    // Check if name exists
    const existingMember = await prisma.member.findFirst({
      where: { fullName: { equals: fullName, mode: 'insensitive' } },
    });
    if (existingMember) {
      return NextResponse.json({ error: 'Name already registered' }, { status: 400 });
    }

    // Get available numbers
    const allNumbers = Array.from({ length: 20 }, (_, i) => i + 1);
    const usedNumbers = await prisma.member.findMany({
      select: { number: true },
    });
    const availableNumbers = allNumbers.filter(
      (num) => !usedNumbers.some((m) => m.number === num)
    );

    if (availableNumbers.length === 0) {
      return NextResponse.json({ error: 'All numbers taken' }, { status: 400 });
    }

    // Pick random number
    const number = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];

    // Create member
    const member = await prisma.member.create({
      data: { fullName, number },
    });

    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
  }
}