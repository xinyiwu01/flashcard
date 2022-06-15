package edu.cmu.cs214.hw1.cli;

import edu.cmu.cs214.hw1.cards.FlashCard;
import edu.cmu.cs214.hw1.ordering.CardDeck;
import edu.cmu.cs214.hw1.ordering.CardOrganizer;
import edu.cmu.cs214.hw1.ordering.CombinedCardOrganizer;
import edu.cmu.cs214.hw1.ordering.prioritization.MostMistakesFirstSorter;
import edu.cmu.cs214.hw1.ordering.prioritization.RecentMistakesFirstSorter;
import edu.cmu.cs214.hw1.ordering.repetition.NonRepeatingCardOrganizer;
import edu.cmu.cs214.hw1.ordering.repetition.RepeatingCardOrganizer;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import static org.junit.Assert.*;


public class UITest {
    private final InputStream systemIn = System.in;
    private ByteArrayInputStream testIn;

    private Collection<FlashCard> cards = new ArrayList<>();
    private FlashCard card1 = new FlashCard("q1", "a1");
    private FlashCard card2 = new FlashCard("q2", "a2");
    private FlashCard card3 = new FlashCard("q3", "a3");

    @Before
    public void setup() {
        cards.add(card1);
        cards.add(card2);
        cards.add(card3);
    }


    public void provideInput(String data) {
        testIn = new ByteArrayInputStream(data.getBytes());
        System.setIn(testIn);
    }

    @After
    public void restoreSystemInput() {
        System.setIn(systemIn);
    }


    @Test
    public void testNonRepeat() {
        CardOrganizer repeater = new NonRepeatingCardOrganizer();
        CardDeck cardDeck = new CardDeck(cards, repeater);

        final String testString = "a1\na2\na3";
        provideInput(testString);

        new UI().studyCards(cardDeck);
        assertTrue(cardDeck.isComplete());
    }

    @Test
    public void testRepeatSuccess() {
        CardOrganizer repeater = new RepeatingCardOrganizer(1);
        CardDeck cardDeck = new CardDeck(cards, repeater);

        final String testString = "a1\na2\na3";
        provideInput(testString);

        new UI().studyCards(cardDeck);
        assertTrue(cardDeck.isComplete());
    }

    @Test
    public void testRepeatFail() {
        CardOrganizer repeater = new RepeatingCardOrganizer(1);
        CardDeck cardDeck = new CardDeck(cards, repeater);

        final String testString = "a1\nwrong\na3\na2";
        provideInput(testString);

        new UI().studyCards(cardDeck);
        assertTrue(cardDeck.isComplete());
    }


    @Test
    public void testMostMistakesRepeat() {
        CardOrganizer repeater = new RepeatingCardOrganizer(2);
        CardOrganizer prioritization = new MostMistakesFirstSorter();
        List<CardOrganizer> organizers = new ArrayList<>();
        organizers.add(prioritization);
        organizers.add(repeater);
        CardOrganizer organizer = new CombinedCardOrganizer(organizers);
        CardDeck cardDeck = new CardDeck(cards, organizer);

        final String testString = "a1\nwrong\na3\na2\nwrong\na3\na2\na1";
        provideInput(testString);

        new UI().studyCards(cardDeck);
        assertTrue(cardDeck.isComplete());
    }

    @Test
    public void testRecentMistakesRepeat() {
        CardOrganizer repeater = new RepeatingCardOrganizer(2);
        CardOrganizer prioritization = new RecentMistakesFirstSorter();
        List<CardOrganizer> organizers = new ArrayList<>();
        organizers.add(prioritization);
        organizers.add(repeater);
        CardOrganizer organizer = new CombinedCardOrganizer(organizers);
        CardDeck cardDeck = new CardDeck(cards, organizer);

        final String testString = "a1\na2\nwrong\na3\nwrong\na2\na1\na3";
        provideInput(testString);

        new UI().studyCards(cardDeck);
        assertTrue(cardDeck.isComplete());
    }
}
